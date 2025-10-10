import axios, { AxiosInstance, AxiosError } from 'axios';
import { ClientConfig, TTSRequest, TTSResponse } from './types';
import { VoicesResponse } from './types/Voices';
import { TypecastAPIError } from './errors';

export class TypecastClient {
  private client: AxiosInstance;
  private config: ClientConfig;

  constructor(config: Partial<ClientConfig> = {}) {
    this.config = {
      baseHost: process.env.TYPECAST_API_HOST || 'https://api.typecast.ai',
      apiKey: process.env.TYPECAST_API_KEY || '',
      ...config,
    };
    this.client = axios.create({
      baseURL: this.config.baseHost,
      headers: {
        'X-API-KEY': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          throw TypecastAPIError.fromResponse(
            error.response.status,
            error.response.statusText,
            error.response.data
          );
        }
        throw error;
      }
    );
  }

  async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    const response = await this.client.post('/v1/text-to-speech', request, {
      responseType: 'arraybuffer',
    });

    return {
      audioData: response.data,
      duration: Number(response.headers['x-audio-duration'] || 0),
      format: (response.headers['content-type'] || 'audio/wav').split('/')[1],
    };
  }

  async getVoices(model?: string): Promise<VoicesResponse[]> {
    const response = await this.client.get('/v1/voices', {
      params: model ? { model } : undefined,
    });
    return response.data;
  }

  async getVoiceById(voiceId: string, model?: string): Promise<VoicesResponse[]> {
    const response = await this.client.get(`/v1/voices/${voiceId}`, {
      params: model ? { model } : undefined,
    });
    return response.data;
  }
}
