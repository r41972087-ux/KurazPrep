import type { FastifyPluginAsync } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { ContentService } from './content.service.js';
import { AppError } from '../../utils/errors.js';
import { SyncParamsSchema, SyncPayloadSchema } from './content.schema.js';

export const contentRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<TypeBoxTypeProvider>();
  const contentService = new ContentService(server.prisma);

  // ── GET /:id/sync ──────────────────────────────────────────────
  app.get(
    '/:id/sync',
    {
      schema: {
        tags: ['Content Sync'],
        summary: 'Download full subject content for offline use',
        description: [
          'Returns all units, short notes, and questions for the given subject.',
          'Supports delta sync: send `If-None-Match: "<contentHash>"` header.',
          'If the hash matches, the server responds with 304 Not Modified.',
        ].join(' '),
        params: SyncParamsSchema,
        response: { 200: SyncPayloadSchema },
      },
    },
    async (request, reply) => {
      try {
        // Check for client-side content hash (delta sync)
        const clientHash = request.headers['if-none-match']?.replace(/"/g, '');

        const payload = await contentService.getSubjectSyncPayload(
          request.params.id,
        );

        // Delta sync: content unchanged → 304
        if (clientHash && clientHash === payload.contentHash) {
          return reply.status(304 as any).send('' as any);
        }

        // Set ETag for future delta sync requests
        reply.header('ETag', `"${payload.contentHash}"`);
        reply.header('Cache-Control', 'no-cache');

        return reply.send(payload);
      } catch (err) {
        if (err instanceof AppError) {
          return reply.status(err.statusCode as any).send(err.toJSON() as any);
        }
        throw err;
      }
    },
  );
};
