import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

import { z } from 'zod';
import { openai } from '../lib/openai';
import {toFile} from 'openai';
import { getStream, ref } from 'firebase/storage';
import { firebaseStorage } from '../lib/firebase';

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post('/videos/:videoId/transcription', async (req) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    });

    const { videoId } = paramsSchema.parse(req.params);

    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(req.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    const videoPath = video.path;

    const storageRef = ref(firebaseStorage, videoPath)
    const file = getStream(storageRef);

    const response = await openai.audio.transcriptions.create({
      file: await toFile(file),
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0, // deixa resposta mais criativa porém com erros (0 até 1)
      prompt,
    });

    const transcription = response.text;

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription,
      },
    });

    return { transcription };
  });
}
