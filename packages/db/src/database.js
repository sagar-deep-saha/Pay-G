import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { Worker, MessageChannel, receiveMessageOnPort } from 'node:worker_threads';
import { runMigrations } from './migrate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

// Load .env if present
if (!process.env.MYSQL_DATABASE && typeof process.loadEnvFile === 'function') {
  try {
    const rootEnv = path.resolve(repoRoot, '.env');
    if (fs.existsSync(rootEnv)) {
      process.loadEnvFile(rootEnv);
    }
  } catch {}
}

/**
 * Checks if core tables exist and executes migrations if not yet initialized.
 * @param {Database} db
 */
export function ensureDatabaseInitialized(db) {
  try {
    let row;
    if (db.client === 'mysql') {
      row = db.queryOne("SELECT count(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'merchants'");
    } else {
      row = db.queryOne("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='merchants'");
    }
    if (!row || Number(row.count) === 0) {
      return runMigrations(db);
    }
  } catch {
    return runMigrations(db);
  }
}

/**
 * Universal Database Client for YOUPI PG.
 * Supports MySQL (default for production/development using 'youpi_pg')
 * and SQLite (for in-memory fast isolated test execution).
 */
export class Database {
  /**
   * @param {{
   *   client?: 'mysql' | 'sqlite',
   *   dbPath?: string,
   *   inMemory?: boolean,
   *   autoMigrate?: boolean,
   *   mysql?: { host?: string, port?: number, user?: string, password?: string, database?: string }
   * }} [options={}]
   */
  constructor(options = {}) {
    this.options = options;

    // In-memory or specific dbPath is explicitly used for SQLite
    if (options.inMemory || options.dbPath || options.client === 'sqlite' || (process.env.DB_CLIENT === 'sqlite' && !options.client)) {
      this.client = 'sqlite';
      this.initSqlite(options);
    } else {
      this.client = 'mysql';
      this.initMysql(options);
    }

    if (!options.inMemory && options.autoMigrate !== false) {
      ensureDatabaseInitialized(this);
    }
  }

  initSqlite(options) {
    if (options.inMemory) {
      this.db = new DatabaseSync(':memory:');
    } else {
      let dbPath;
      if (options.dbPath) {
        dbPath = path.isAbsolute(options.dbPath)
          ? options.dbPath
          : path.resolve(process.cwd(), options.dbPath);
      } else if (process.env.SQLITE_DB_PATH) {
        dbPath = path.isAbsolute(process.env.SQLITE_DB_PATH)
          ? process.env.SQLITE_DB_PATH
          : path.resolve(repoRoot, process.env.SQLITE_DB_PATH);
      } else {
        dbPath = path.resolve(repoRoot, 'data/youpi_pg.sqlite');
      }
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
      }
      this.db = new DatabaseSync(dbPath);
      // The file holds webhook secrets, session-token indexes, OTPs and customer PII.
      // Default file creation honours umask, which on many hosts leaves it group/world
      // readable, so restrict it explicitly.
      try { fs.chmodSync(dbPath, 0o600); } catch {}
      try { fs.chmodSync(dir, 0o700); } catch {}
    }

    this.db.exec('PRAGMA foreign_keys = ON;');
    this.db.exec('PRAGMA busy_timeout = 5000;');
    try {
      this.db.exec('PRAGMA journal_mode = WAL;');
    } catch {}
  }

  initMysql(options) {
    // Parse connection config
    let host = options.mysql?.host || process.env.MYSQL_HOST || 'localhost';
    let port = options.mysql?.port || Number(process.env.MYSQL_PORT || 3306);
    let user = options.mysql?.user || process.env.MYSQL_USER || 'root';
    let password = options.mysql?.password !== undefined ? options.mysql.password : (process.env.MYSQL_PASSWORD || '');
    let database = options.mysql?.database || process.env.MYSQL_DATABASE || 'youpi_pg';

    if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql://')) {
      try {
        const u = new URL(process.env.DATABASE_URL);
        host = u.hostname || host;
        port = u.port ? Number(u.port) : port;
        user = u.username || user;
        password = u.password || password;
        database = u.pathname ? u.pathname.replace(/^\//, '') : database;
      } catch {}
    }

    const dbConfig = { host, port, user, password, database };
    const workerScript = path.resolve(__dirname, 'mysql-worker.js');

    this.sab = new SharedArrayBuffer(4);
    this.ia = new Int32Array(this.sab);
    const { port1, port2 } = new MessageChannel();
    this.port = port1;

    this.worker = new Worker(workerScript, {
      workerData: { port: port2, sab: this.sab, dbConfig },
      transferList: [port2]
    });

    // Wait for worker ready
    Atomics.wait(this.ia, 0, 0);
    const ready = receiveMessageOnPort(this.port);
    if (!ready || ready.message?.status === 'ERROR') {
      const errMsg = ready?.message?.error || 'Failed to initialize MySQL worker';
      this.worker.terminate();
      throw new Error(`[Database MySQL Error] ${errMsg}`);
    }
  }

  /**
   * Dispatches a synchronous message to the MySQL worker and awaits result.
   */
  dispatchMysqlSync(msg) {
    Atomics.store(this.ia, 0, 0);
    this.port.postMessage(msg);
    Atomics.wait(this.ia, 0, 0);
    const received = receiveMessageOnPort(this.port);
    if (!received) {
      throw new Error('MySQL worker did not return a response');
    }
    const payload = received.message;
    if (payload.error) {
      const err = new Error(payload.error);
      if (payload.code) err.code = payload.code;
      throw err;
    }
    return payload.result;
  }

  /**
   * Normalizes parameter markers from PostgreSQL style ($1, $2) to standard style (?, ?).
   * @param {string} sql
   * @returns {string}
   */
  normalizeSql(sql) {
    return sql.replace(/\$\d+/g, '?');
  }

  /**
   * Executes a statement (INSERT, UPDATE, DELETE, DDL).
   * @param {string} sql
   * @param {any[]} [params=[]]
   * @returns {{ changes: number, lastInsertRowid: number | bigint }}
   */
  execute(sql, params = []) {
    const normalized = this.normalizeSql(sql);
    if (this.client === 'sqlite') {
      const stmt = this.db.prepare(normalized);
      return stmt.run(...params);
    } else {
      return this.dispatchMysqlSync({ type: 'execute', sql: normalized, params });
    }
  }

  run(sql, params = []) {
    return this.execute(sql, params);
  }

  /**
   * Queries multiple rows.
   * @param {string} sql
   * @param {any[]} [params=[]]
   * @returns {any[]}
   */
  query(sql, params = []) {
    const normalized = this.normalizeSql(sql);
    if (this.client === 'sqlite') {
      const stmt = this.db.prepare(normalized);
      return stmt.all(...params);
    } else {
      return this.dispatchMysqlSync({ type: 'query', sql: normalized, params });
    }
  }

  /**
   * Queries a single row.
   * @param {string} sql
   * @param {any[]} [params=[]]
   * @returns {any | null}
   */
  queryOne(sql, params = []) {
    const normalized = this.normalizeSql(sql);
    if (this.client === 'sqlite') {
      const stmt = this.db.prepare(normalized);
      const res = stmt.get(...params);
      return res !== undefined ? res : null;
    } else {
      const rows = this.dispatchMysqlSync({ type: 'query', sql: normalized, params });
      return (rows && rows.length > 0) ? rows[0] : null;
    }
  }

  /**
   * Executes a batch of DDL or SQL statements.
   * @param {string} sql
   */
  exec(sql) {
    if (this.client === 'sqlite') {
      this.db.exec(sql);
    } else {
      this.dispatchMysqlSync({ type: 'exec', sql });
    }
  }

  /**
   * Executes a callback within an ACID database transaction.
   * Automatically rolls back on exception.
   * @param {() => T} callback
   * @returns {T}
   */
  transaction(callback) {
    // IMMEDIATE (not DEFERRED) so the write lock is taken up front in SQLite. A deferred transaction
    // starts as a read transaction and only upgrades on first write, which lets two
    // concurrent slot-acquisition callers both observe a free slot before either writes.
    const beginSql = this.client === 'sqlite' ? 'BEGIN IMMEDIATE;' : 'START TRANSACTION;';
    this.exec(beginSql);
    try {
      const result = callback();
      this.exec('COMMIT;');
      return result;
    } catch (err) {
      try {
        this.exec('ROLLBACK;');
      } catch {
        // Ignore rollback error if already rolled back
      }
      throw err;
    }
  }

  /**
   * Closes the database connection.
   */
  close() {
    if (this.client === 'sqlite') {
      this.db?.close();
    } else if (this.worker) {
      try {
        this.dispatchMysqlSync({ type: 'close' });
      } catch {}
      this.worker.terminate();
    }
  }
}

let defaultDbInstance = null;

/**
 * Returns the singleton database instance.
 * @param {{ client?: 'mysql' | 'sqlite', dbPath?: string, inMemory?: boolean }} [options={}]
 * @returns {Database}
 */
export function getDatabase(options = {}) {
  if (!defaultDbInstance) {
    defaultDbInstance = new Database(options);
  }
  return defaultDbInstance;
}
