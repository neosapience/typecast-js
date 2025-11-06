# Typecast Node.js SDK

[![npm version](https://img.shields.io/npm/v/@neosapience/typecast-js.svg)](https://www.npmjs.com/package/@neosapience/typecast-js)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-green.svg)](https://nodejs.org/)

The official Node.js library for the [Typecast API](https://typecast.ai). Convert text to lifelike speech using AI-powered voices.

Works with both JavaScript and TypeScript. Full TypeScript types included.

ESM & CommonJS supported. This SDK targets Node.js environments only (browser usage is not supported).

## Installation

```bash
npm install @neosapience/typecast-js
```

## Quick Start

### TypeScript (ESM)

```typescript
import { TypecastClient } from '@neosapience/typecast-js';
import fs from 'fs';

async function main() {
  const client = new TypecastClient({ apiKey: 'YOUR_API_KEY' });
  const audio = await client.textToSpeech({
    text: "Hello there! I'm your friendly text-to-speech agent.",
    model: "ssfm-v21",
    voice_id: "tc_62a8975e695ad26f7fb514d1"
  });
  await fs.promises.writeFile(`output.${audio.format}`, Buffer.from(audio.audioData));
  console.log(`Audio saved! Duration: ${audio.duration}s, Format: ${audio.format}`);
}

main();
```

### JavaScript (CommonJS)

```javascript
const { TypecastClient } = require('@neosapience/typecast-js');
const fs = require('fs');

async function main() {
  const client = new TypecastClient({ apiKey: 'YOUR_API_KEY' });
  const audio = await client.textToSpeech({
    text: "Hello there! I'm your friendly text-to-speech agent.",
    model: "ssfm-v21",
    voice_id: "tc_62a8975e695ad26f7fb514d1"
  });
  await fs.promises.writeFile(`output.${audio.format}`, Buffer.from(audio.audioData));
  console.log(`Audio saved! Duration: ${audio.duration}s, Format: ${audio.format}`);
}

main();
```

## Configuration

The client can be configured using environment variables or constructor options:

```typescript
// Using environment variables
// export TYPECAST_API_KEY=your_api_key
const client = new TypecastClient({
  apiKey: process.env.TYPECAST_API_KEY!
});

// Or pass API key directly
const client = new TypecastClient({
  apiKey: 'your_api_key'
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
  - `emotion_preset`: Emotion type for the voice. Available options include `'happy' | 'sad' | 'normal' | 'angry' | 'tonemid' | 'toneup'` (default: `'normal'`). Note: Each voice supports different emotions - check the voice's `emotions` array using `getVoices()` to see which emotions are supported.
  - `emotion_intensity`: 0.0 - 2.0 (default: 1.0)
- **output** (optional): Audio output settings
  - `audio_format`: `'wav' | 'mp3'` (default: `'wav'`)
  - `volume`: 0 - 200 (default: 100)
  - `audio_pitch`: -12 - 12 semitones (default: 0)
  - `audio_tempo`: 0.5 - 2.0 (default: 1.0)
- **seed** (optional): Random seed for reproducible results

### Get Voices

List all available voices, optionally filtered by model.

**Signature:** `getVoices(model?: string): Promise<Voice[]>`

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

For detailed Voice object fields, see the [API Reference](https://typecast.ai/docs/api-reference).

### Get Voice by ID

Get information about a specific voice.

**Signature:** `getVoiceById(voiceId: string, model?: string): Promise<Voice[]>`

```typescript
const voiceInfo = await client.getVoiceById("tc_62a8975e695ad26f7fb514d1");
console.log(`Voice: ${voiceInfo[0].voice_name}`);
console.log(`Model: ${voiceInfo[0].model}`);
console.log(`Supported emotions: ${voiceInfo[0].emotions.join(', ')}`);
```

**Voice Object Fields:**
- `voice_id`: Unique identifier (format: `tc_*` or `uc_*`)
- `voice_name`: Human-readable name of the voice
- `model`: Voice model type (`ssfm-v21`)
- `emotions`: Array of supported emotion presets for this voice

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

### Working with Voice Emotions

Each voice supports different emotion presets. Check which emotions a voice supports before using them:

```typescript
// Get voice information
const voices = await client.getVoices("ssfm-v21");
const myVoice = voices.find(v => v.voice_id === "tc_62a8975e695ad26f7fb514d1");

console.log(`${myVoice.voice_name} supports: ${myVoice.emotions.join(', ')}`);
// Example output: "Olivia supports: tonemid, toneup, normal, happy, sad, angry"

// Use a supported emotion
if (myVoice.emotions.includes('happy')) {
  const audio = await client.textToSpeech({
    text: "This voice supports the happy emotion!",
    voice_id: myVoice.voice_id,
    model: "ssfm-v21",
    prompt: {
      emotion_preset: "happy",
      emotion_intensity: 1.5
    }
  });
  // Save: await fs.promises.writeFile(`happy.${audio.format}`, Buffer.from(audio.audioData));
}
```

### Emotion Control

```typescript
// Happy and energetic voice
const happyAudio = await client.textToSpeech({
  text: "Great to see you!",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  prompt: {
    emotion_preset: "happy",
    emotion_intensity: 1.8
  },
  output: {
    audio_tempo: 1.2
  }
});
// Save: await fs.promises.writeFile(`happy.${happyAudio.format}`, Buffer.from(happyAudio.audioData));

// Calm and professional voice
const calmAudio = await client.textToSpeech({
  text: "Welcome to our presentation.",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  prompt: {
    emotion_preset: "normal",
    emotion_intensity: 0.8
  },
  output: {
    audio_tempo: 0.9
  }
});
// Save: await fs.promises.writeFile(`calm.${calmAudio.format}`, Buffer.from(calmAudio.audioData));
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
// Save: await fs.promises.writeFile(`custom.${customAudio.format}`, Buffer.from(customAudio.audioData));
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
// Save: await fs.promises.writeFile(`korean.${koreanAudio.format}`, Buffer.from(koreanAudio.audioData));

// Japanese text
const japaneseAudio = await client.textToSpeech({
  text: "こんにちは。お元気ですか。",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  language: "jpn"
});
// Save: await fs.promises.writeFile(`japanese.${japaneseAudio.format}`, Buffer.from(japaneseAudio.audioData));
```

### Error Handling

```typescript
import { TypecastClient, TypecastAPIError } from '@neosapience/typecast-js';

async function main() {
  const client = new TypecastClient({ apiKey: 'YOUR_API_KEY' });

  try {
    const audio = await client.textToSpeech({
      text: "Hello world",
      voice_id: "tc_62a8975e695ad26f7fb514d1",
      model: "ssfm-v21"
    });
  } catch (error) {
    if (error instanceof TypecastAPIError) {
      // TypecastAPIError exposes: statusCode (number), message (string), response (unknown)
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
}

main();
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
} from '@neosapience/typecast-js';
```

## Documentation

- [Typecast API Documentation](https://typecast.ai/docs)
- [API Reference](https://typecast.ai/docs/api-reference)
- [Quickstart Guide](https://typecast.ai/docs/quickstart)

## License

Apache-2.0 License
