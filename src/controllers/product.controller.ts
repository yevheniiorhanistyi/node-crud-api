import { FastifyReply, FastifyRequest } from "fastify";
import { ProductInput, ProductId } from "../schemas/product.schema.js";
import { productService } from "../services/product.service.js";

export const getAllProducts = async (request: FastifyRequest, reply: FastifyReply) => {
  const products = await productService.getAll();
  reply.send(products);
};

export const getProductById = async (
  request: FastifyRequest<{
    Params: ProductId;
  }>,
  reply: FastifyReply
) => {
  const product = await productService.getOne(request.params.id);
  if (!product) {
    return reply.status(404).send({
      error: "Product not found",
    });
  }

  reply.send(product);
};

export const createProduct = async (
  request: FastifyRequest<{
    Body: ProductInput;
  }>,
  reply: FastifyReply
) => {
  const newProduct = await productService.create(request.body);
  return reply.status(201).send(newProduct);
};

export const updateProduct = async (
  request: FastifyRequest<{
    Params: ProductId;
    Body: ProductInput;
  }>,
  reply: FastifyReply
) => {
  const updated = await productService.update(request.params.id, request.body);

  if (!updated) {
    return reply.status(404).send({
      error: "Product not found",
    });
  }
  reply.send(updated);
};

export const deleteProduct = async (
  request: FastifyRequest<{
    Params: ProductId;
  }>,
  reply: FastifyReply
) => {
  const deleted = await productService.delete(request.params.id);
  if (!deleted) {
    return reply.status(404).send({
      error: "Product not found",
    });
  }
  reply.status(204).send();
};
