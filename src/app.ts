import Fastify from "fastify";
import dotenv from "dotenv";

import { routes as productRoutes } from "./routes/product.routes.js";
import { errorHandler } from "./errors/errorHandler.js";
import { notFoundHandler } from "./errors/notFoundHandler.js";

dotenv.config();

const app = Fastify({
  logger: true,
});

app.setNotFoundHandler(notFoundHandler);
app.setErrorHandler(errorHandler);
app.register(productRoutes, {
  prefix: "/api/products",
});

const PORT = Number(process.env.PORT) || 4000;

const start = async () => {
  try {
    await app.listen({
      port: PORT,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
