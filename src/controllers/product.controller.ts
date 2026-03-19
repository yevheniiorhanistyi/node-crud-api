import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { Product, ProductInput, ProductId } from "../schemas/product.schema.js";
import { products } from "../db/memory.db.js";

export const getAllProducts = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send(products);
};

export const getProductById = async (
  request: FastifyRequest<{
    Params: ProductId;
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return reply.status(404).send({
      error: "Product not found",
    });
  } else {
    reply.send(product);
  }
};

export const createProduct = async (
  request: FastifyRequest<{
    Body: ProductInput;
  }>,
  reply: FastifyReply
) => {
  const newProduct: Product = {
    id: randomUUID(),
    ...request.body,
  };
  products.push(newProduct);
  return reply.status(201).send(newProduct);
};

export const updateProduct = async (
  request: FastifyRequest<{
    Params: ProductId;
    Body: ProductInput;
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return reply.status(404).send({
      error: "Product not found",
    });
  } else {
    const updatedProduct = {
      ...request.body,
      id,
    };
    products[index] = updatedProduct;
    reply.send(updatedProduct);
  }
};

export const deleteProduct = async (
  request: FastifyRequest<{
    Params: ProductId;
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return reply.status(404).send({
      error: "Product not found",
    });
  } else {
    products.splice(index, 1);
    reply.status(204).send();
  }
};
