import Fastify from "fastify";
import Clerk from "@clerk/fastify";

const fastify = Fastify();

fastify.register(Clerk.clerkPlugin);

fastify.get("/health", (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  })
});

fastify.get("/test", (request, reply) => {
  const {userId} = Clerk.getAuth(request);

  if(!userId){
    return reply.send({ message: "Not logged in" });
  }
  return reply.send({
    message: "Order service is authenticated!",
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 8001 });
    console.log("Order service is running on port 8001");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
start();
