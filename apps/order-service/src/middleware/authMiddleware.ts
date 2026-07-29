import { FastifyReply, FastifyRequest } from "fastify";
import Clerk from "@clerk/fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const shouldBeUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { userId } = Clerk.getAuth(request);
  if (!userId) {
    return reply.status(401).send({ message: "You are not logged in!" });
  }

  request.userId = userId;
};
