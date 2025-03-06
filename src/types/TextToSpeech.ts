export type TTSModel = 'ssfm-v10' | 'ssfm-v12' | 'ssfm-v20' | 'ssfm-v21';

export interface Prompt {
  emotion_preset?: 'happy' | 'sad' | 'normal' | 'angry';
  emotion_intensity?: number;
  speed?: number;
  intonation?: number;
}

export interface Output {
  volume?: number;
  audio_pitch?: number;
  audio_tempo?: number;
  audio_format?: 'wav' | 'mp3';
}

export interface TTSRequest {
  text: string;
  voice_id: string;
  model: TTSModel;
  language?: string;
  prompt?: Prompt;
  output?: Output;
  seed?: number;
}

export interface TTSResponse {
  audioData: ArrayBuffer;
  duration: number;
  format: string;
}
