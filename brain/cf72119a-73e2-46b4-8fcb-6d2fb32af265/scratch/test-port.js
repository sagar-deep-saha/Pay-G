import { Worker, MessageChannel, receiveMessageOnPort, isMainThread, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';

if (isMainThread) {
  const sab = new SharedArrayBuffer(4);
  const ia = new Int32Array(sab);
  const { port1, port2 } = new MessageChannel();

  const w = new Worker(fileURLToPath(import.meta.url), {
    workerData: { port: port2, sab },
    transferList: [port2]
  });

  // Wait for worker ready
  Atomics.wait(ia, 0, 0);
  const readyMsg = receiveMessageOnPort(port1);
  console.log('Worker ready:', readyMsg.message);

  // Send request
  Atomics.store(ia, 0, 0);
  port1.postMessage({ val: 42 });
  Atomics.wait(ia, 0, 0);
  const res = receiveMessageOnPort(port1);
  console.log('Sync received response:', res.message);

  w.terminate();
} else {
  const { port, sab } = workerData;
  const ia = new Int32Array(sab);

  port.on('message', (msg) => {
    port.postMessage({ answer: msg.val * 2, time: new Date() });
    Atomics.store(ia, 0, 1);
    Atomics.notify(ia, 0, 1);
  });

  port.postMessage({ status: 'READY' });
  Atomics.store(ia, 0, 1);
  Atomics.notify(ia, 0, 1);
}
