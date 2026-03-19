import cluster from "node:cluster";
import http from "node:http";
import { availableParallelism } from "node:os";
import { randomUUID } from "node:crypto";
import { InternalIpcMessage } from "../types/ipc.types.js";
import { Product } from "../schemas/product.schema.js";
import { products } from "../db/memory.db.js";

export const startPrimary = () => {
  const PORT = Number(process.env.PORT) || 4000;
  const numWorkers = availableParallelism();

  cluster.on("message", (worker, message: InternalIpcMessage) => {
    if (!worker) return;

    const { type, requestId } = message;

    let result: Product | Product[] | null | boolean = null;

    switch (type) {
      case "GET_ALL": {
        result = products;
        break;
      }

      case "GET_ONE": {
        result = products.find((p) => p.id === message.payload) || null;
        break;
      }

      case "CREATE": {
        const newProduct = { id: randomUUID(), ...message.payload };
        products.push(newProduct);
        result = newProduct;
        break;
      }

      case "UPDATE": {
        const { id, data } = message.payload;
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
          products[index] = { ...products[index], ...data, id };
          result = products[index];
        }
        break;
      }

      case "DELETE": {
        const i = products.findIndex((p) => p.id === message.payload);
        result = i !== -1;
        if (i !== -1) products.splice(i, 1);
        break;
      }
    }

    worker.send({ requestId, result });
  });

  for (let i = 0; i < numWorkers - 1; i++) {
    cluster.fork({ PORT: PORT + i + 1 });
  }

  let currentWorkerIndex = 0;

  const server = http.createServer((req, res) => {
    const targetPort = PORT + 1 + (currentWorkerIndex % (numWorkers - 1));
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
