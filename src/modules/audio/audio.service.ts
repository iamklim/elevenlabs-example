import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class AudioService {
  async createAudioFile({
    sessionId,
    dirPath,
    audio,
    index,
  }: {
    sessionId: string;
    dirPath: string;
    audio: Buffer;
    index: number;
  }): Promise<Buffer> {
    const audioFilePath = join(dirPath, `audio_${index}.mp3`);

    try {
      await fs.writeFile(audioFilePath, audio);
      console.log(`${sessionId}: created audio file ${audioFilePath}`);

      return await fs.readFile(audioFilePath);
    } catch (error) {
      console.error(
        `${sessionId}: error creating audio file ${audioFilePath}:`,
        error,
      );
    }
  }
}
