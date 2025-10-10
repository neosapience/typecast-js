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

/**
 * Emotion and style settings for the generated speech
 */
export interface Prompt {
  /** Emotion preset for the voice (default: 'normal') */
  emotion_preset?: 'happy' | 'sad' | 'normal' | 'angry';
  /** 
   * Emotion intensity
   * @min 0.0
   * @max 2.0
   * @default 1.0
   */
  emotion_intensity?: number;
  /** 
   * Speech speed
   * @min 0.5
   * @max 2.0
   * @default 1.0
   */
  speed?: number;
  /** 
   * Intonation adjustment
   * @min -2
   * @max 2
   * @default 0
   */
  intonation?: number;
}

/**
 * Audio output settings for controlling the final audio characteristics
 */
export interface Output {
  /** 
   * Output volume
   * @min 0
   * @max 200
   * @default 100
   */
  volume?: number;
  /** 
   * Audio pitch adjustment in semitones
   * @min -12
   * @max 12
   * @default 0
   */
  audio_pitch?: number;
  /** 
   * Audio tempo (speed multiplier)
   * @min 0.5
   * @max 2.0
   * @default 1.0
   */
  audio_tempo?: number;
  /** 
   * Audio output format
   * @default 'wav'
   */
  audio_format?: 'wav' | 'mp3';
}

/**
 * Text-to-Speech request parameters
 */
export interface TTSRequest {
  /** 
   * Text to convert to speech
   * @maxLength 5000
   */
  text: string;
  /** Voice ID in format 'tc_' (Typecast voice) or 'uc_' (User-created voice) followed by a unique identifier */
  voice_id: string;
  /** Voice model to use */
  model: TTSModel;
  /** Language code (ISO 639-3). If not provided, will be auto-detected based on text content */
  language?: LanguageCode;
  /** Emotion and style settings for the generated speech */
  prompt?: Prompt;
  /** Audio output settings */
  output?: Output;
  /** Random seed for reproducible results (same seed + same parameters = same output) */
  seed?: number;
}

/**
 * Text-to-Speech response
 */
export interface TTSResponse {
  /** Generated audio data as ArrayBuffer */
  audioData: ArrayBuffer;
  /** Audio duration in seconds */
  duration: number;
  /** Audio format (wav or mp3) */
  format: string;
}
