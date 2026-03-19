import { ZodError } from "zod";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((issue) => {
      return {
        path: issue.path.join("."),
        message: issue.message,
      };
    });
    return reply.code(400).send({
      error: "Bad Request",
      message: formattedErrors.map((e) => `${e.path}: ${e.message}`).join("; "),
    });
  }

  const statusCode = error.statusCode ?? 500;

  reply.status(statusCode).send({
    error: statusCode === 500 ? "Internal Server Error" : error.name || "Error",
    message: error.message,
  });
};
