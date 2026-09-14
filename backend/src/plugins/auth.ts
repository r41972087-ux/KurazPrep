import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

const authPlugin: FastifyPluginAsync = async (server) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  await server.register(fastifyJwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: '15m', // Short-lived access tokens
    },
  });

  // Decorator for protecting routes — use as onRequest hook
  server.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        reply.status(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid or expired access token',
        });
      }
    },
  );
};

export default fp(authPlugin, { name: 'auth' });
