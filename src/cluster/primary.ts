import cluster from "node:cluster";
import http from "node:http";
import { availableParallelism } from "node:os";
import { InternalIpcMessage } from "../types/ipc.types.js";
import { localDB } from "../db/memory.db.js";

export const startPrimary = () => {
  const PORT = Number(process.env.PORT) || 4000;
  const numWorkers = availableParallelism();

  cluster.on("message", (worker, message: InternalIpcMessage) => {
    if (!worker) return;

    const { type, requestId } = message;

    const result = (() => {
      switch (type) {
        case "GET_ALL":
          return localDB.getAll();
        case "GET_ONE":
          return localDB.getOne(message.payload) || null;
        case "CREATE":
          return localDB.create(message.payload);
        case "UPDATE":
          return localDB.update(message.payload.id, message.payload.data);
        case "DELETE":
          return localDB.delete(message.payload);
        default:
          return null;
      }
    })();

    if (worker.isConnected()) worker.send({ requestId, result });
  });

  const workerCount = Math.max(1, numWorkers - 1);

  for (let i = 0; i < workerCount; i++) {
    cluster.fork({ PORT: PORT + i + 1 });
  }

  let currentWorkerIndex = 0;

  const server = http.createServer((req, res) => {
    const targetPort = PORT + 1 + (currentWorkerIndex % workerCount);
    currentWorkerIndex++;

    const options = {
      hostname: "127.0.0.1",
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on("error", (err) => {
      console.error("Proxy error:", err);
      res.writeHead(500);
      res.end("Internal Server Error");
    });

    req.pipe(proxyReq);
  });

  server.listen(PORT, () => {
    console.log(`Load balancer is running on port ${PORT}`);
  });
};
