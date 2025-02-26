export interface TTSRequest {
    text: string;
    voice_id: string;
    model: string;
    emotion?: string;
    language?: string;
    tempo?: number;
    speed?: number;
    emotion_scale?: number;
    seed?: number;
  }
  
  export interface TTSResponse {
    audioData: ArrayBuffer;
    duration: number;
    format: string;
  }
  