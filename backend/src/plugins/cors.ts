import fp from 'fastify-plugin';
import fastifyCors from '@fastify/cors';
import type { FastifyPluginAsync } from 'fastify';

const corsPlugin: FastifyPluginAsync = async (server) => {
  await server.register(fastifyCors, {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://kurazprep.com']
        : true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'If-None-Match'],
    exposedHeaders: ['ETag'],
    credentials: true,
  });
};

export default fp(corsPlugin, { name: 'cors' });
