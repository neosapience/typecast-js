export interface ClientConfig {
  baseHost: string;
  apiKey: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface TTSRequest {
  text: string;
  character_id: string;
  model: string;
  language?: string;
  audio_format?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
  emotion?: string;
  emotion_strength?: number;
}

export interface TTSResponse {
  audioData: ArrayBuffer;
  duration: number;
  format: string;
}
