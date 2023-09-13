import { fastify } from 'fastify';
import { getAllPrompts } from './routes/get-all-prompts';
import { uploadVideo } from './routes/upload-video';
import { createTranscriptionRoute } from './routes/create-transcription';
import { generateAICompletionRoute } from './routes/generate-ai-completion';

const app = fastify();

app.register(getAllPrompts);
app.register(uploadVideo);
app.register(createTranscriptionRoute);
app.register(generateAICompletionRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP Server Running'));
