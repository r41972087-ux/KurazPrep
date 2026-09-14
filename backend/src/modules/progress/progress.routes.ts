import type { FastifyPluginAsync } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { ProgressService } from './progress.service.js';
import { authGuard } from '../../middleware/auth.guard.js';
import {
  QuizSubmitBodySchema,
  QuizSubmitResponseSchema,
  DashboardResponseSchema,
} from './progress.schema.js';

export const progressRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<TypeBoxTypeProvider>();
  const progressService = new ProgressService(server.prisma);

  // ── POST /quiz ─────────────────────────────────────────────────
  app.post(
    '/quiz',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Progress'],
        summary: 'Submit quiz attempt results',
        description:
          'Uploads a completed quiz attempt with per-question details. Requires authentication.',
        security: [{ bearerAuth: [] }],
        body: QuizSubmitBodySchema,
        response: { 201: QuizSubmitResponseSchema },
      },
    },
    async (request, reply) => {
      const result = await progressService.submitQuizResult(
        request.user.userId,
        request.body,
      );
      return reply.status(201).send(result);
    },
  );

  // ── GET /dashboard ─────────────────────────────────────────────
  app.get(
    '/dashboard',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Progress'],
        summary: 'Get progress dashboard with weak areas',
        description:
          'Returns overall quiz stats, per-subject progress, weak areas (< 60% accuracy), and recent attempts.',
        security: [{ bearerAuth: [] }],
        response: { 200: DashboardResponseSchema },
      },
    },
    async (request) => {
      return progressService.getDashboard(request.user.userId);
    },
  );
};
