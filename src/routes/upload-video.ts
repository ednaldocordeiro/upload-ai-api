import path from 'node:path';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';

import { FastifyInstance } from 'fastify';
import { fastifyMultipart } from '@fastify/multipart';

import { prisma } from '../lib/prisma';

import {firebaseStorage} from '../lib/firebase'
import { ref, uploadBytes } from 'firebase/storage';


export async function uploadVideo(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25mb
    },
  });
  app.post('/videos', async (req, res) => {
    const data = await req.file();

    if (!data) {
      return res.status(400).send({ error: 'Missing file input' });
    }

    const extension = path.extname(data.filename);

    if (extension !== '.mp3') {
      return res
        .status(400)
        .send({ error: 'Invalid input type, please upload a MP3' });
    }

    const fileBuffer = await data.toBuffer();

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `audios/${fileBaseName}-${randomUUID()}${extension}`;

    const storageRef = ref(firebaseStorage, `audios/${fileUploadName}`)
    const {metadata: {fullPath}} = await uploadBytes(storageRef, fileBuffer, {
      contentType: 'audio/mpeg'
    });

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: fullPath,
      }
    });
      
    return {
      video
    }
  });
}
