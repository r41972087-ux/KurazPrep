import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Pre-handler hook that requires a valid JWT access token.
 *
 * Usage in route options:
 *   { onRequest: [authGuard] }
 */
export async function authGuard(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Authentication required. Please provide a valid access token.',
    });
  }
}
