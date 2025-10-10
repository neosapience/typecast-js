export type TTSModel = 'ssfm-v21';

/**
 * Language code following ISO 639-3 standard
 * Supported languages for text-to-speech conversion
 */
export type LanguageCode =
  | 'eng' // English
  | 'kor' // Korean
  | 'jpn' // Japanese
  | 'spa' // Spanish
  | 'deu' // German
  | 'fra' // French
  | 'ita' // Italian
  | 'pol' // Polish
  | 'nld' // Dutch
  | 'rus' // Russian
  | 'ell' // Greek
  | 'tam' // Tamil
  | 'tgl' // Tagalog
  | 'fin' // Finnish
  | 'zho' // Chinese
  | 'slk' // Slovak
  | 'ara' // Arabic
  | 'hrv' // Croatian
  | 'ukr' // Ukrainian
  | 'ind' // Indonesian
  | 'dan' // Danish
  | 'swe' // Swedish
  | 'msa' // Malay
  | 'ces' // Czech
  | 'por' // Portuguese
  | 'bul' // Bulgarian
  | 'ron'; // Romanian

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
  language?: LanguageCode;
  prompt?: Prompt;
  output?: Output;
  seed?: number;
}

export interface TTSResponse {
  audioData: ArrayBuffer;
  duration: number;
  format: string;
}
