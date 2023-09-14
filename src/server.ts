import { fastify } from 'fastify';
import {fastifyCors} from '@fastify/cors';

import { getAllPrompts } from './routes/get-all-prompts';
import { uploadVideo } from './routes/upload-video';
import { createTranscriptionRoute } from './routes/create-transcription';
import { generateAICompletionRoute } from './routes/generate-ai-completion';
import { resolve } from 'node:path';

const app = fastify();

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../tmp'),
  prefix: '/tmp',
})

app.register(fastifyCors, {
  origin: '*', // endereço de onde estará hospedado o front
})

app.register(getAllPrompts);
app.register(uploadVideo);
app.register(createTranscriptionRoute);
app.register(generateAICompletionRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP Server Running'));
