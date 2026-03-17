import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const server = Fastify();

server.get("/", async () => {
  return { message: "API works!" };
});

const PORT = Number(process.env.PORT) || 4000;

server.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});
