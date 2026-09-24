import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 ContentPilot AI API Server running at http://localhost:${env.PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(`🤖 LLM Provider: ${env.LLM_PROVIDER} (${env.LLM_MODEL})`);
  console.log(`🔍 Embedding Provider: ${env.EMBEDDING_PROVIDER} (${env.EMBEDDING_MODEL})`);
});

const shutdown = () => {
  console.log('\n🛑 Gracefully shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
