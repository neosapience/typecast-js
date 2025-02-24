import axios, { AxiosInstance } from 'axios';
import { ClientConfig, TTSRequest, TTSResponse } from './types';

export class TypecastClient {
  private client: AxiosInstance;
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseHost,
      headers: {
        'X-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    const response = await this.client.post('/v1/text-to-speech', request, {
      responseType: 'arraybuffer',
    });

    if (response.status !== 200) {
      throw new Error(`API request failed: ${response.status}, ${response.statusText}`);
    }

    return {
      audioData: response.data,
      duration: Number(response.headers['x-audio-duration'] || 0),
      format: (response.headers['content-type'] || 'audio/wav').split('/')[1],
    };
  }
}
