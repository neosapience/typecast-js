import { TTSModel } from './TextToSpeech';

export interface VoicesResponse {
  voice_id: string;
  voice_name: string;
  model: TTSModel;
  emotions: string[];
}
