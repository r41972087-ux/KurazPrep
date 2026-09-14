import type { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { hashToken } from '../../utils/hash.js';
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../../utils/errors.js';

const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const BCRYPT_ROUNDS = 12;

export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly fastify: FastifyInstance,
  ) {}

  /**
   * Register a new user with email + password.
   * Returns access token, refresh token, and user profile.
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
    stream?: 'NATURAL_SCIENCE' | 'SOCIAL_SCIENCE';
    gradeLevel?: number;
  }) {
    // Check uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        stream: data.stream ?? 'NATURAL_SCIENCE',
        gradeLevel: data.gradeLevel ?? 12,
      },
    });

    const tokens = await this.generateTokenPair(user);
    return { ...tokens, user: this.formatUser(user) };
  }

  /**
   * Authenticate with email + password.
   */
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = await this.generateTokenPair(user);
    return { ...tokens, user: this.formatUser(user) };
  }

  /**
   * Rotate refresh token.
   * Implements family-based reuse detection: if a revoked token is
   * presented, the entire token family is invalidated (theft signal).
   */
  async refresh(rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);

    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    // Unknown token
    if (!record) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Already revoked → possible theft → nuke the family
    if (record.isRevoked) {
      await this.prisma.refreshToken.updateMany({
        where: { familyId: record.familyId },
        data: { isRevoked: true },
      });
      throw new ForbiddenError(
        'Refresh token reuse detected. All sessions revoked — please login again.',
      );
    }

    // Expired
    if (record.expiresAt < new Date()) {
      await this.prisma.refreshToken.update({
        where: { id: record.id },
        data: { isRevoked: true },
      });
      throw new UnauthorizedError('Refresh token has expired');
    }

    // Revoke current token
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { isRevoked: true },
    });

    // Issue new pair in the same family
    return this.generateTokenPair(record.user, record.familyId);
  }

  /**
   * Fetch user profile by ID.
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.formatUser(user);
  }

  // ── Private Helpers ──────────────────────────────────────────────

  private async generateTokenPair(
    user: { id: string; email: string; gradeLevel: number },
    familyId?: string,
  ) {
    // JWT access token (15 min)
    const accessToken = this.fastify.jwt.sign({
      userId: user.id,
      email: user.email,
      gradeLevel: user.gradeLevel,
    });

    // Opaque refresh token (UUID, 7 days)
    const rawRefreshToken = crypto.randomUUID();
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        familyId: familyId ?? crypto.randomUUID(),
        expiresAt,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private formatUser(user: {
    id: string;
    email: string;
    name: string;
    stream: string;
    gradeLevel: number;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      stream: user.stream,
      gradeLevel: user.gradeLevel,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
