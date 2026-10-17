import { parentPort, workerData } from 'node:worker_threads';
import mysql from 'mysql2/promise';

const { port, sab, dbConfig } = workerData;
const ia = new Int32Array(sab);

let pool = null;

async function init() {
  try {
    pool = mysql.createPool({
      host: dbConfig.host || 'localhost',
      port: Number(dbConfig.port || 3306),
      user: dbConfig.user || 'root',
      password: dbConfig.password || '',
      database: dbConfig.database || 'youpi_pg',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
      dateStrings: true,
      charset: 'utf8mb4'
    });

    // Test ping
    const testConn = await pool.getConnection();
    testConn.release();

    port.postMessage({ status: 'READY' });
  } catch (err) {
    port.postMessage({ status: 'ERROR', error: err.message });
  } finally {
    Atomics.store(ia, 0, 1);
    Atomics.notify(ia, 0, 1);
  }
}

port.on('message', async (msg) => {
  try {
    if (!pool) {
      throw new Error('MySQL pool is not initialized');
    }

    if (msg.type === 'query') {
      const [rows] = await pool.query(msg.sql, msg.params || []);
      port.postMessage({ result: rows });
    } else if (msg.type === 'execute') {
      const [res] = await pool.query(msg.sql, msg.params || []);
      port.postMessage({
        result: {
          changes: res?.affectedRows ?? 0,
          lastInsertRowid: res?.insertId ?? 0
        }
      });
    } else if (msg.type === 'exec') {
      await pool.query(msg.sql);
      port.postMessage({ result: true });
    } else if (msg.type === 'close') {
      await pool.end();
      port.postMessage({ result: true });
    } else {
      throw new Error(`Unknown message type: ${msg.type}`);
    }
  } catch (err) {
    port.postMessage({ error: err.message, code: err.code });
  } finally {
    Atomics.store(ia, 0, 1);
    Atomics.notify(ia, 0, 1);
  }
});

init();
