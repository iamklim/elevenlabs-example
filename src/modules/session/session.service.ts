import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { AudioService } from '../audio/audio.service';
import { ElevenlabsService } from '../elevenlabs/elevenlabs.service';

interface ISessionTask {
  queue: (() => Promise<void>)[];
  isProcessing: boolean;
  textChunks: string[];
  requestIds: string[];
}

const MOCKED_TEXT = [
  'Find a comfortable position, either sitting or lying down. Gently close your eyes and take a deep breath in, and slowly exhale. Allow yourself to settle into the present moment.',
  'Inhale deeply and exhale completely.',
  'Notice the rise and fall of your chest with each breath. Allow your breath to become your anchor, grounding you in the now.',
  'As you breathe, bring your awareness to your body. Starting at your toes, feel the sensation of relaxation spreading upward.',
  'Feel your toes relaxing... your feet... your ankles...',
  "Continue to guide your awareness up through your legs, hips, and torso. Feel any tension melting away with each breath.',",
  "Move your awareness to your chest and shoulders. Feel your shoulders drop and your chest expand with each inhale.',",
  "Notice your neck and face. Release any tension in your jaw, around your eyes, and your forehead. Let your entire face soften.',",
];

@Injectable()
export class SessionService {
  private sessionTasks: Map<string, ISessionTask> = new Map();

  constructor(
    private readonly elevenlabsService: ElevenlabsService,
    private readonly audioService: AudioService,
  ) {}

  private async processQueue(sessionId: string) {
    const sessionTask = this.sessionTasks.get(sessionId);
    if (!sessionTask || sessionTask.isProcessing) return;

    sessionTask.isProcessing = true;

    try {
      while (sessionTask.queue.length > 0) {
        const task = sessionTask.queue.shift();

        if (task) {
          await task();
        }
      }
    } catch (error) {
      console.error(
        `${sessionId}: error processing queue for session ${sessionId}:`,
        error,
      );
    } finally {
      sessionTask.isProcessing = false;
    }
  }

  async start(voiceId: string): Promise<void> {
    const sessionId = uuidv4();
    const dirPath = `/tmp/${sessionId}`;

    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`${sessionId}: created session directory ${dirPath}`);
    } catch (error) {
      console.error(`error creating session directory:`, error);
      return;
    }

    this.sessionTasks.set(sessionId, {
      queue: [],
      isProcessing: false,
      textChunks: [],
      requestIds: [],
    });

    MOCKED_TEXT.forEach((text, index) => {
      const sessionTask = this.sessionTasks.get(sessionId);

      if (sessionTask) {
        sessionTask.textChunks.push(text);

        sessionTask.queue.push(async () => {
          try {
            console.log(`${sessionId}: processing text chunk ${index}`);

            const previousRequestIds = sessionTask.requestIds.slice(-3);
            const previousText = sessionTask.textChunks[index - 1] || null;
            const nextText = sessionTask.textChunks[index + 1] || null;

            const { audio, requestId } =
              await this.elevenlabsService.textToSpeech(
                sessionId,
                text,
                voiceId,
                previousRequestIds,
                previousText,
                nextText,
              );

            if (requestId) {
              sessionTask.requestIds.push(requestId);
            }

            if (audio) {
              console.log(`${sessionId}: processing audio chunk ${index}`);
              await this.audioService.createAudioFile({
                sessionId,
                dirPath,
                audio,
                index,
              });

              console.log(`${sessionId}: audio file is ready ${index}`);
            }
          } catch (error) {
            console.error(
              `${sessionId}: error processing text chunk ${index}:`,
              error,
            );
          }
        });

        this.processQueue(sessionId);
      }
    });
  }
}
