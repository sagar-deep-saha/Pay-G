import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

if (isMainThread) {
  const sharedBuffer = new SharedArrayBuffer(4 * 1024 * 1024); // 4MB buffer
  const signalArray = new Int32Array(sharedBuffer, 0, 1);
  const dataBuffer = new Uint8Array(sharedBuffer, 8);

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

  Atomics.wait(signalArray, 0, 0);

  function querySync(sql, params = []) {
    Atomics.store(signalArray, 0, 0);
    worker.postMessage({ type: 'query', sql, params });
    Atomics.wait(signalArray, 0, 0);
    const length = new Int32Array(sharedBuffer, 4, 1)[0];
    const bytes = dataBuffer.subarray(0, length);
    const jsonStr = new TextDecoder().decode(bytes);
    const res = JSON.parse(jsonStr);
    if (res.error) throw new Error(res.error);
    return res.data;
  }

  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    querySync('SELECT count(*) as count FROM merchants');
  }
  const total = (performance.now() - start).toFixed(2);
  console.log(`100 consecutive synchronous queries completed in ${total}ms (~${(total / 100).toFixed(2)}ms per query)`);

  worker.terminate();
  process.exit(0);
} else {
  const { sharedBuffer, dbConfig } = workerData;
  const signalArray = new Int32Array(sharedBuffer, 0, 1);
  const lengthArray = new Int32Array(sharedBuffer, 4, 1);
  const dataBuffer = new Uint8Array(sharedBuffer, 8);

  (async () => {
    const conn = await mysql.createConnection(dbConfig);
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
