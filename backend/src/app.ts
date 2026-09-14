import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

// Plugins
import prismaPlugin from './plugins/prisma.js';
import authPlugin from './plugins/auth.js';
import corsPlugin from './plugins/cors.js';
import swaggerPlugin from './plugins/swagger.js';

// Route modules
import { authRoutes } from './modules/auth/auth.routes.js';
import { subjectsRoutes } from './modules/subjects/subjects.routes.js';
import { contentRoutes } from './modules/content/content.routes.js';
import { progressRoutes } from './modules/progress/progress.routes.js';

/**
 * Build and configure the Fastify application.
 * Separated from server.ts for testability.
 */
export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // ── Global Plugins (order matters) ─────────────────────────────
  await app.register(corsPlugin);
  await app.register(swaggerPlugin);
  await app.register(prismaPlugin);
  await app.register(authPlugin);

  // ── Route Modules ──────────────────────────────────────────────
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(subjectsRoutes, { prefix: '/api/v1/subjects' });
  await app.register(contentRoutes, { prefix: '/api/v1/subjects' });
  await app.register(progressRoutes, { prefix: '/api/v1/progress' });

  // ── Health Check ───────────────────────────────────────────────
  app.get(
    '/health',
    {
      schema: {
        tags: ['System'],
        summary: 'Health check',
        response: {
          200: {
            type: 'object' as const,
            properties: {
              status: { type: 'string' as const },
              timestamp: { type: 'string' as const },
              uptime: { type: 'number' as const },
            },
          },
        },
      },
    },
    async () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }),
  );

  return app;
}
