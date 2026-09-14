import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyPluginAsync } from 'fastify';

const swaggerPlugin: FastifyPluginAsync = async (server) => {
  await server.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'KurazPrep API',
        description:
          'Ethiopian ESSLCE Exam Preparation API — offline-first content sync and progress tracking.',
        version: '1.0.0',
        contact: {
          name: 'KurazPrep Team',
        },
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Local Development',
        },
      ],
      tags: [
        { name: 'Authentication', description: 'Register, login, refresh tokens' },
        { name: 'Subjects', description: 'Browse available subjects and units' },
        { name: 'Content Sync', description: 'Download content for offline use' },
        { name: 'Progress', description: 'Quiz submissions and dashboard analytics' },
        { name: 'System', description: 'Health checks and diagnostics' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Access token (15-minute expiry)',
          },
        },
      },
    },
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
    },
  });
};

export default fp(swaggerPlugin, { name: 'swagger' });
