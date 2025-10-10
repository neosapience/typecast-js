# Typecast SDK

Official TypeScript SDK for [Typecast API](https://typecast.ai) - Text-to-Speech with AI voices.

## Installation

```bash
npm install typecast-sdk
```

## Quick Start

```typescript
import { TypecastClient } from 'typecast-sdk';
import fs from 'fs';

// Initialize client with API key
const client = new TypecastClient({
  apiKey: 'YOUR_API_KEY'
});

// Convert text to speech
const audio = await client.textToSpeech({
  text: "Hello there! I'm your friendly text-to-speech agent.",
  model: "ssfm-v21",
  voice_id: "tc_62a8975e695ad26f7fb514d1"
});

// Save audio file
await fs.promises.writeFile('output.wav', Buffer.from(audio.audioData));
console.log(`Audio saved! Duration: ${audio.duration}s, Format: ${audio.format}`);
```

## Configuration

The client can be configured using environment variables or constructor options:

```typescript
// Using environment variables
// TYPECAST_API_KEY=your_api_key
// TYPECAST_API_HOST=https://api.typecast.ai (optional)
const client = new TypecastClient();

// Using constructor options
const client = new TypecastClient({
  apiKey: 'your_api_key',
  baseHost: 'https://api.typecast.ai' // optional
});
```

## API Reference

### Text-to-Speech

Generate speech from text using a specified voice model.

```typescript
const response = await client.textToSpeech({
  text: "Hello. How are you?",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  language: "eng", // optional, auto-detected if not provided
  prompt: {
    emotion_preset: "happy",
    emotion_intensity: 1.5
  },
  output: {
    audio_format: "mp3",
    volume: 100,
    audio_pitch: 0,
    audio_tempo: 1.0
  },
  seed: 42 // for reproducible results
});
```

#### Parameters

- **text** (required): Text to convert to speech (max 5000 characters)
- **voice_id** (required): Voice ID (format: `tc_*` for Typecast voices, `uc_*` for user-created voices)
- **model** (required): Voice model (`ssfm-v21`)
- **language** (optional): Language code (see supported languages below)
- **prompt** (optional): Emotion and style settings
  - `emotion_preset`: `'happy' | 'sad' | 'normal' | 'angry'` (default: `'normal'`)
  - `emotion_intensity`: 0.0 - 2.0 (default: 1.0)
  - `speed`: 0.5 - 2.0 (default: 1.0)
  - `intonation`: -2 - 2 (default: 0)
- **output** (optional): Audio output settings
  - `audio_format`: `'wav' | 'mp3'` (default: `'wav'`)
  - `volume`: 0 - 200 (default: 100)
  - `audio_pitch`: -12 - 12 semitones (default: 0)
  - `audio_tempo`: 0.5 - 2.0 (default: 1.0)
- **seed** (optional): Random seed for reproducible results

### Get Voices

List all available voices, optionally filtered by model.

```typescript
// Get all voices
const voices = await client.getVoices();

// Get voices for specific model
const voices = await client.getVoices("ssfm-v21");

voices.forEach(voice => {
  console.log(`${voice.voice_name} (${voice.voice_id})`);
  console.log(`Emotions: ${voice.emotions.join(', ')}`);
});
```

### Get Voice by ID

Get information about a specific voice.

```typescript
const voiceInfo = await client.getVoiceById("tc_62a8975e695ad26f7fb514d1");
console.log(voiceInfo);
```

## Supported Languages

The SDK supports 27 languages with automatic language detection:

| Code | Language   | Code | Language   | Code | Language   |
|------|------------|------|------------|------|------------|
| eng  | English    | jpn  | Japanese   | ukr  | Ukrainian  |
| kor  | Korean     | ell  | Greek      | ind  | Indonesian |
| spa  | Spanish    | tam  | Tamil      | dan  | Danish     |
| deu  | German     | tgl  | Tagalog    | swe  | Swedish    |
| fra  | French     | fin  | Finnish    | msa  | Malay      |
| ita  | Italian    | zho  | Chinese    | ces  | Czech      |
| pol  | Polish     | slk  | Slovak     | por  | Portuguese |
| nld  | Dutch      | ara  | Arabic     | bul  | Bulgarian  |
| rus  | Russian    | hrv  | Croatian   | ron  | Romanian   |

If not specified, the language will be automatically detected from the input text.

## Advanced Examples

### Emotion Control

```typescript
// Happy and energetic voice
const happyAudio = await client.textToSpeech({
  text: "Great to see you!",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  prompt: {
    emotion_preset: "happy",
    emotion_intensity: 1.8,
    speed: 1.2
  }
});

// Calm and professional voice
const calmAudio = await client.textToSpeech({
  text: "Welcome to our presentation.",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  prompt: {
    emotion_preset: "normal",
    emotion_intensity: 0.8,
    speed: 0.9
  }
});
```

### Audio Customization

```typescript
// Generate louder audio with higher pitch
const customAudio = await client.textToSpeech({
  text: "This is a test with custom settings.",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  output: {
    volume: 150,
    audio_pitch: 3,
    audio_tempo: 1.1,
    audio_format: "mp3"
  }
});
```

### Multilingual Content

```typescript
// Korean text
const koreanAudio = await client.textToSpeech({
  text: "안녕하세요. 반갑습니다.",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  language: "kor"
});

// Japanese text
const japaneseAudio = await client.textToSpeech({
  text: "こんにちは。お元気ですか。",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  language: "jpn"
});
```

### Error Handling

```typescript
import { TypecastClient, TypecastAPIError } from 'typecast-sdk';

try {
  const audio = await client.textToSpeech({
    text: "Hello world",
    voice_id: "tc_62a8975e695ad26f7fb514d1",
    model: "ssfm-v21"
  });
} catch (error) {
  if (error instanceof TypecastAPIError) {
    switch (error.statusCode) {
      case 401:
        console.error('Invalid API key');
        break;
      case 402:
        console.error('Insufficient credits');
        break;
      case 422:
        console.error('Validation error:', error.response);
        break;
      default:
        console.error(`API error (${error.statusCode}):`, error.message);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions:

```typescript
import type { 
  TTSRequest, 
  TTSResponse, 
  LanguageCode,
  Prompt,
  Output
} from 'typecast-sdk';
```

## Documentation

- [Typecast API Documentation](https://typecast.ai/docs)
- [API Reference](https://typecast.ai/docs/api-reference)
- [Quickstart Guide](https://typecast.ai/docs/quickstart)

## License

MIT License
