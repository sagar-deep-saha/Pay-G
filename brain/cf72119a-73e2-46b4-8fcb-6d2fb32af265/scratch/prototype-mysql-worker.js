import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

if (isMainThread) {
  // Main thread test
  const sharedBuffer = new SharedArrayBuffer(1024 * 1024); // 1MB buffer
  const signalArray = new Int32Array(sharedBuffer, 0, 1);
  const dataBuffer = new Uint8Array(sharedBuffer, 4);

  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: {
      sharedBuffer,
      dbConfig: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'youpi_pg'
      }
    }
  });

  // Wait for worker ready signal
  Atomics.wait(signalArray, 0, 0);
  console.log('Worker is ready!');

  function querySync(sql, params = []) {
    // Reset signal to 0
    Atomics.store(signalArray, 0, 0);
    worker.postMessage({ type: 'query', sql, params });
    // Wait until signal changes to 1
    Atomics.wait(signalArray, 0, 0);
    // Read length and payload
    const length = new Int32Array(sharedBuffer, 4, 1)[0];
    const bytes = dataBuffer.subarray(4, 4 + length);
    const jsonStr = new TextDecoder().decode(bytes);
    const res = JSON.parse(jsonStr);
    if (res.error) throw new Error(res.error);
    return res.data;
  }

  const start = performance.now();
  const rows = querySync('SELECT * FROM merchants');
  const elapsed = (performance.now() - start).toFixed(2);
  console.log(`Synchronous query result in ${elapsed}ms:`, rows);

  worker.terminate();
  process.exit(0);
} else {
  // Worker thread
  const { sharedBuffer, dbConfig } = workerData;
  const signalArray = new Int32Array(sharedBuffer, 0, 1);
  const lengthArray = new Int32Array(sharedBuffer, 4, 1);
  const dataBuffer = new Uint8Array(sharedBuffer, 8);

  (async () => {
    const conn = await mysql.createConnection(dbConfig);
    // Notify ready
    Atomics.store(signalArray, 0, 1);
    Atomics.notify(signalArray, 0, 1);

    parentPort.on('message', async (msg) => {
      try {
        if (msg.type === 'query') {
          const [rows] = await conn.query(msg.sql, msg.params);
          const jsonBytes = new TextEncoder().encode(JSON.stringify({ data: rows }));
          dataBuffer.set(jsonBytes);
          lengthArray[0] = jsonBytes.length;
        }
      } catch (err) {
        const jsonBytes = new TextEncoder().encode(JSON.stringify({ error: err.message }));
        dataBuffer.set(jsonBytes);
        lengthArray[0] = jsonBytes.length;
      }
      Atomics.store(signalArray, 0, 1);
      Atomics.notify(signalArray, 0, 1);
    });
  })();
}
