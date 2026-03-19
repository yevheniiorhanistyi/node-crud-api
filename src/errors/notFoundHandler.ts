import { FastifyReply, FastifyRequest } from "fastify";

export const notFoundHandler = (request: FastifyRequest, reply: FastifyReply) => {
  reply.code(404).send({
    error: "Not Found",
    message: `Route ${request.method}:${request.url} not found`,
  });
};
