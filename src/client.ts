import axios, { AxiosInstance, AxiosError } from 'axios';
import { ClientConfig, TTSRequest, TTSResponse, ApiErrorResponse } from './types';
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
      (error: AxiosError<ApiErrorResponse>) => {
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
    const response = await this.client.post<ArrayBuffer>('/v1/text-to-speech', request, {
      responseType: 'arraybuffer',
    });

    const contentType = String(response.headers['content-type'] || 'audio/wav');
    const formatFromHeader = contentType.split('/')[1] || 'wav';
    const format: 'wav' | 'mp3' = formatFromHeader === 'mp3' ? 'mp3' : 'wav';

    const durationHeader: unknown = response.headers['x-audio-duration'];
    const duration = typeof durationHeader === 'string' ? Number(durationHeader) : 0;

    return {
      audioData: response.data,
      duration,
      format,
    };
  }

  async getVoices(model?: string): Promise<VoicesResponse[]> {
    const response = await this.client.get<VoicesResponse[]>('/v1/voices', {
      params: model ? { model } : undefined,
    });
    return response.data;
  }

  async getVoiceById(voiceId: string, model?: string): Promise<VoicesResponse[]> {
    const response = await this.client.get<VoicesResponse[]>(`/v1/voices/${voiceId}`, {
      params: model ? { model } : undefined,
    });
    return response.data;
  }
}
