import { fastify } from 'fastify';
import { getAllPrompts } from './routes/get-all-prompts';
import { uploadVideo } from './routes/upload-video';

const app = fastify();

app.register(getAllPrompts);
app.register(uploadVideo);

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP Server Running'));
