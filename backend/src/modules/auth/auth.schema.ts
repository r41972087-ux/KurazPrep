import { Type, type Static } from '@sinclair/typebox';

// ─── Request Schemas ─────────────────────────────────────────────────

export const RegisterBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  name: Type.String({ minLength: 1 }),
  stream: Type.Optional(
    Type.Union([
      Type.Literal('NATURAL_SCIENCE'),
      Type.Literal('SOCIAL_SCIENCE'),
    ]),
  ),
  gradeLevel: Type.Optional(Type.Integer({ minimum: 11, maximum: 12 })),
});
export type RegisterBody = Static<typeof RegisterBodySchema>;

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});
export type LoginBody = Static<typeof LoginBodySchema>;

export const RefreshBodySchema = Type.Object({
  refreshToken: Type.String(),
});
export type RefreshBody = Static<typeof RefreshBodySchema>;

// ─── Response Schemas ────────────────────────────────────────────────

export const UserResponseSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  name: Type.String(),
  stream: Type.String(),
  gradeLevel: Type.Integer(),
  createdAt: Type.String(),
});

export const AuthResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
  user: UserResponseSchema,
});

export const TokenResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export const ErrorResponseSchema = Type.Object({
  statusCode: Type.Integer(),
  error: Type.String(),
  message: Type.String(),
});
