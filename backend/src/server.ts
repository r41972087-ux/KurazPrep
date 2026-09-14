import 'dotenv/config';
import { buildApp } from './app.js';

async function main() {
  const app = await buildApp();

  // Ensure Swagger specs are compiled before listening
  await app.ready();

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';

  await app.listen({ port, host });

  app.log.info(`🚀 KurazPrep API running at http://${host}:${port}`);
  app.log.info(`📖 Swagger docs at http://${host}:${port}/docs`);
}

main().catch((err) => {
  console.error('Fatal: Failed to start server:', err);
  process.exit(1);
});
