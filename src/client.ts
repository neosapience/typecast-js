import axios, { AxiosInstance, AxiosError } from 'axios';
import { ClientConfig, TTSRequest, TTSResponse, ApiErrorResponse } from './types';
import { VoicesResponse, VoiceV2Response, VoicesV2Filter } from './types/Voices';
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

  /**
   * Convert text to speech
   * @param request - TTS request parameters including text, voice_id, model, and optional settings
   * @returns TTSResponse containing audio data, duration, and format
   */
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

  /**
   * Get available voices (V1 API)
   * @param model - Optional model filter (e.g., 'ssfm-v21', 'ssfm-v30')
   * @returns List of available voices with their emotions
   * @deprecated Use getVoicesV2() for enhanced metadata and filtering options
   */
  async getVoices(model?: string): Promise<VoicesResponse[]> {
    const response = await this.client.get<VoicesResponse[]>('/v1/voices', {
      params: model ? { model } : undefined,
    });
    return response.data;
  }

  /**
   * Get voice by ID (V1 API)
   * @param voiceId - The voice ID (e.g., 'tc_62a8975e695ad26f7fb514d1')
   * @param model - Optional model filter
   * @returns Voice information including available emotions
   * @deprecated Use getVoicesV2() for enhanced metadata
   */
  async getVoiceById(voiceId: string, model?: string): Promise<VoicesResponse[]> {
    const response = await this.client.get<VoicesResponse[]>(`/v1/voices/${voiceId}`, {
      params: model ? { model } : undefined,
    });
    return response.data;
  }

  /**
   * Get voices with enhanced metadata (V2 API)
   * Returns voices with model-grouped emotions and additional metadata
   * @param filter - Optional filter options (model, gender, age, use_cases)
   */
  async getVoicesV2(filter?: VoicesV2Filter): Promise<VoiceV2Response[]> {
    const response = await this.client.get<VoiceV2Response[]>('/v2/voices', {
      params: filter,
    });
    return response.data;
  }
}
