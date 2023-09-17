import { createReadStream, createWriteStream } from 'node:fs';

import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

import { z } from 'zod';
import { openai } from '../lib/openai';
import {toFile} from 'openai';
import { getDownloadURL, getStream, ref } from 'firebase/storage';
import { firebaseAdminStorage, firebaseStorage } from '../lib/firebase';

import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import path from 'node:path';

const pump = promisify(pipeline);

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

    const destination = path.resolve(__dirname, '../../tmp', video.path)

    await pump(file, createWriteStream(destination))

    const audioReadStream = createReadStream(destination);

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
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
