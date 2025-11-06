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

## Features

- 🎙️ **Multiple Voice Models**: Support for AI voice models with natural speech synthesis
- 🌍 **Multi-language Support**: 27+ languages including English, Korean, Spanish, Japanese, Chinese, and more
- 😊 **Emotion Control**: Adjust emotional expression (happy, sad, angry, normal, tonemid, toneup) with intensity control
- 🎚️ **Audio Customization**: Control volume (0-200), pitch (-12 to +12 semitones), tempo (0.5x to 2.0x), and format (WAV/MP3)
- 🔍 **Voice Discovery**: List and search available voices by model
- 📝 **TypeScript Support**: Full type definitions included

## Configuration

Set your API key via environment variable or constructor:

```typescript
// Using environment variable
// export TYPECAST_API_KEY="your-api-key-here"
const client = new TypecastClient({
  apiKey: process.env.TYPECAST_API_KEY!
});

// Or pass directly
const client = new TypecastClient({
  apiKey: 'your-api-key-here'
});
```

## Advanced Usage

### Emotion and Audio Control

Control emotion, volume, pitch, tempo, and output format:

```typescript
const audio = await client.textToSpeech({
  text: "I am so excited to show you these features!",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  language: "eng",
  prompt: {
    emotion_preset: "happy",      // Options: normal, happy, sad, angry, tonemid, toneup
    emotion_intensity: 1.5        // Range: 0.0 to 2.0
  },
  output: {
    volume: 120,                  // Range: 0 to 200
    audio_pitch: 2,               // Range: -12 to +12 semitones
    audio_tempo: 1.2,             // Range: 0.5x to 2.0x
    audio_format: "mp3"           // Options: wav, mp3
  },
  seed: 42                        // For reproducible results
});

await fs.promises.writeFile(`output.${audio.format}`, Buffer.from(audio.audioData));
console.log(`Duration: ${audio.duration}s, Format: ${audio.format}`);
```

### Voice Discovery

List and search available voices:

```typescript
// List all voices
const voices = await client.getVoices();

// Filter by model
const v21Voices = await client.getVoices("ssfm-v21");

// Get specific voice
const voiceInfo = await client.getVoiceById("tc_62a8975e695ad26f7fb514d1");
console.log(`Voice: ${voiceInfo[0].voice_name}`);
console.log(`Available emotions: ${voiceInfo[0].emotions.join(', ')}`);
```

### Multilingual Content

The SDK supports 27+ languages with automatic language detection:

```typescript
// Auto-detect language (recommended)
const audio = await client.textToSpeech({
  text: "こんにちは。お元気ですか。",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21"
});

// Or specify language explicitly
const koreanAudio = await client.textToSpeech({
  text: "안녕하세요. 반갑습니다.",
  voice_id: "tc_62a8975e695ad26f7fb514d1",
  model: "ssfm-v21",
  language: "kor"  // ISO 639-3 language code
});
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

## Error Handling

The SDK provides `TypecastAPIError` for handling API errors:

```typescript
import { TypecastClient, TypecastAPIError } from '@neosapience/typecast-js';

try {
  const audio = await client.textToSpeech({
    text: "Hello world",
    voice_id: "tc_62a8975e695ad26f7fb514d1",
    model: "ssfm-v21"
  });
} catch (error) {
  if (error instanceof TypecastAPIError) {
    // TypecastAPIError exposes: statusCode, message, response
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
} from '@neosapience/typecast-js';
```

## Documentation

- [Typecast API Documentation](https://typecast.ai/docs)
- [API Reference](https://typecast.ai/docs/api-reference)
- [Quickstart Guide](https://typecast.ai/docs/quickstart)

## License

Apache-2.0 License
