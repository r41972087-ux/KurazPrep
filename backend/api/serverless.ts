import * as dotenv from 'dotenv';
dotenv.config();

import { buildApp } from '../src/app';

// Initialize the Fastify app
const app = buildApp();

export default async function (req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}
