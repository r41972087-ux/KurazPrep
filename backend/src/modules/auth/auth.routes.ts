import type { FastifyPluginAsync } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { AuthService } from './auth.service.js';
import { authGuard } from '../../middleware/auth.guard.js';
import {
  RegisterBodySchema,
  LoginBodySchema,
  RefreshBodySchema,
  AuthResponseSchema,
  TokenResponseSchema,
  UserResponseSchema,
  ErrorResponseSchema,
} from './auth.schema.js';
import { AppError } from '../../utils/errors.js';

export const authRoutes: FastifyPluginAsync = async (server) => {
  const app = server.withTypeProvider<TypeBoxTypeProvider>();
  const authService = new AuthService(server.prisma, server);

  // ── POST /register ─────────────────────────────────────────────
  app.post(
    '/register',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Register a new account',
        body: RegisterBodySchema,
        response: { 201: AuthResponseSchema, 409: ErrorResponseSchema },
      },
    },
    async (request, reply) => {
      try {
        const result = await authService.register(request.body);
        return reply.status(201).send(result);
      } catch (err) {
        if (err instanceof AppError) {
          return reply.status(err.statusCode as any).send(err.toJSON() as any);
        }
        throw err;
      }
    },
  );

  // ── POST /login ────────────────────────────────────────────────
  app.post(
    '/login',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Login with email and password',
        body: LoginBodySchema,
        response: { 200: AuthResponseSchema, 401: ErrorResponseSchema },
      },
    },
    async (request, reply) => {
      try {
        const result = await authService.login(
          request.body.email,
          request.body.password,
        );
        return reply.send(result);
      } catch (err) {
        if (err instanceof AppError) {
          return reply.status(err.statusCode as any).send(err.toJSON() as any);
        }
        throw err;
      }
    },
  );

  // ── POST /refresh ──────────────────────────────────────────────
  app.post(
    '/refresh',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Rotate refresh token and get new access token',
        body: RefreshBodySchema,
        response: {
          200: TokenResponseSchema,
          401: ErrorResponseSchema,
          403: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await authService.refresh(request.body.refreshToken);
        return reply.send(result);
      } catch (err) {
        if (err instanceof AppError) {
          return reply.status(err.statusCode as any).send(err.toJSON() as any);
        }
        throw err;
      }
    },
  );

  // ── GET /me ────────────────────────────────────────────────────
  app.get(
    '/me',
    {
      onRequest: [authGuard],
      schema: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        response: { 200: UserResponseSchema, 401: ErrorResponseSchema },
      },
    },
    async (request, reply) => {
      try {
        const user = await authService.getProfile(request.user.userId);
        return reply.send(user);
      } catch (err) {
        if (err instanceof AppError) {
          return reply.status(err.statusCode as any).send(err.toJSON() as any);
        }
        throw err;
      }
    },
  );
};
