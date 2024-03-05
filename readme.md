# AI Stack - Wun

This is a ai stack meant for educational purposes to teach the basics of AI LLM and RAG.

## Getting started

First we need to install our pre-reqs...

```bash
npm install -g pnpm
pnpm i
pnpm exec playwright install
```

Mext we need to create a `.env` file in the services directory with the following content:

```
OPENAI_API_KEY=PUT_YOUR_API_KEY_HERE
TRAIN_ON_START=true
```

We should now be ready to setup and start the application

```bash
pnpm i
pnpm start
```
