import { ZodType } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";

type RequestProperty = "body" | "params" | "query" | "headers";

export const validate =
  <T>(schema: ZodType<T>, property: RequestProperty = "body") =>
  (req: FastifyRequest, reply: FastifyReply, done: (error?: Error) => void) => {
    try {
      schema.parse(req[property]);
      done();
    } catch (error) {
      done(error as Error);
    }
  };
