# Local Development Guide

## Running Without Cloud AI Services (Ollama Fallback)

To run ContentPilot AI 100% offline without API keys:

1. Install [Ollama](https://ollama.com).
2. Pull the required models:
   ```bash
   ollama pull llama3.2:3b
   ollama pull nomic-embed-text
   ```
3. Update `.env`:
   ```env
   LLM_PROVIDER=ollama
   EMBEDDING_PROVIDER=ollama
   OLLAMA_URL=http://localhost:11434
   ```
4. Start the stack: `pnpm dev`.
