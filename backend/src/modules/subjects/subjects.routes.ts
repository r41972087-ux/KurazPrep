import type { FastifyPluginAsync } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { SubjectsService } from './subjects.service.js';
import { AppError } from '../../utils/errors.js';
import {
  SubjectParamsSchema,
  SubjectsQuerySchema,
  SubjectsListSchema,
  SubjectDetailSchema,
} from './subjects.schema.js';

export const subjectsRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<TypeBoxTypeProvider>();
  const subjectsService = new SubjectsService(server.prisma);

  // ── GET / ──────────────────────────────────────────────────────
  app.get(
    '/',
    {
      schema: {
        tags: ['Subjects'],
        summary: 'List all subjects',
        description:
          'Returns subjects optionally filtered by academic stream and/or grade level.',
        querystring: SubjectsQuerySchema,
        response: { 200: SubjectsListSchema },
      },
    },
    async (request) => {
      return subjectsService.listSubjects(request.query);
    },
  );

  // ── GET /:id ───────────────────────────────────────────────────
  app.get(
    '/:id',
    {
      schema: {
        tags: ['Subjects'],
        summary: 'Get subject details with units',
        params: SubjectParamsSchema,
        response: { 200: SubjectDetailSchema },
      },
    },
    async (request, reply) => {
      try {
        return await subjectsService.getSubjectById(request.params.id);
      } catch (err) {
        if (err instanceof AppError) {
          return reply.status(err.statusCode as any).send(err.toJSON() as any);
        }
        throw err;
      }
    },
  );
};
