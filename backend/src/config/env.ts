/**
 * Environment configuration with validation.
 * Fails fast on missing required variables.
 */

export interface AppConfig {
  DATABASE_URL: string;
  JWT_SECRET: string;
  PORT: number;
  HOST: string;
  NODE_ENV: 'development' | 'production' | 'test';
  LOG_LEVEL: string;
}

export function loadConfig(): AppConfig {
  const DATABASE_URL = requireEnv('DATABASE_URL');
  const JWT_SECRET = requireEnv('JWT_SECRET');

  if (JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  return {
    DATABASE_URL,
    JWT_SECRET,
    PORT: parseInt(process.env.PORT || '3000', 10),
    HOST: process.env.HOST || '0.0.0.0',
    NODE_ENV: (process.env.NODE_ENV as AppConfig['NODE_ENV']) || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  };
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
