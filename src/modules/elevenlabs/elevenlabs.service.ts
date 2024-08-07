import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ElevenlabsService {
  private readonly apiKey: string;
  private readonly modelId: string = 'eleven_multilingual_v2';
  private readonly apiUrl: string =
    'https://api.elevenlabs.io/v1/text-to-speech';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('ELEVENLABS_API_KEY');
    axiosRetry(this.httpService.axiosRef, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        const responseStatus = error.response.status;

        return (
          responseStatus === 408 || // 408 Request Timeout
          responseStatus === 409 || // 409 Conflict
          responseStatus === 429 || // 429 Rate Limit
          responseStatus >= 500 // >=500 Internal errors
        );
      },
    });
  }

  async textToSpeech(
    sessionId: string,
    text: string,
    voice: string,
    previousRequestIds: string[],
    previousText?: string,
    nextText?: string,
  ): Promise<{ audio: Buffer; requestId: string }> {
    const url = `${this.apiUrl}/${voice}`;
    const headers = {
      'xi-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.post(
          url,
          {
            text,
            previous_request_ids: previousRequestIds,
            previous_text: previousText,
            next_text: nextText,
            model_id: this.modelId,
          },
          {
            headers,
            responseType: 'arraybuffer',
            timeout: 30000, // 30s
          },
        ),
      );

      const audio = response.data;
      const requestId = response.headers['request-id'];

      return { audio, requestId };
    } catch (error) {
      console.error(`${sessionId}: error calling ElevenLabs API:`, error);
      throw new Error('Failed to generate speech. Please try again later.');
    }
  }
}
