import Fastify from "fastify";

import { routes as productRoutes } from "../routes/product.routes.js";
import { errorHandler } from "../errors/errorHandler.js";
import { notFoundHandler } from "../errors/notFoundHandler.js";

export const startWorker = async () => {
  const PORT = Number(process.env.PORT) || 4000;

  const app = Fastify();

  app.setNotFoundHandler(notFoundHandler);
  app.setErrorHandler(errorHandler);
  app.register(productRoutes, {
    prefix: "/api/products",
  });

  try {
    await app.listen({
      port: PORT,
    });
    console.log(`Worker is running on port ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  return app;
};
