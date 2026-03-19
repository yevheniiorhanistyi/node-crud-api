import { FastifyInstance } from "fastify";
import { productSchema, productIdSchema } from "../schemas/product.schema.js";
import * as productController from "../controllers/product.controller.js";
import { validate } from "../utils/validators.js";

export const routes = (fastify: FastifyInstance) => {
  fastify.get("/", productController.getAllProducts);

  fastify.get(
    "/:id",
    {
      preValidation: validate(productIdSchema, "params"),
    },
    productController.getProductById
  );

  fastify.post(
    "/",
    {
      preValidation: validate(productSchema),
    },
    productController.createProduct
  );

  fastify.put(
    "/:id",
    {
      preValidation: [validate(productIdSchema, "params"), validate(productSchema)],
    },
    productController.updateProduct
  );

  fastify.delete(
    "/:id",
    {
      preValidation: validate(productIdSchema, "params"),
    },
    productController.deleteProduct
  );
};
