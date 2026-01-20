# Typecast Node.js SDK

[![npm version](https://img.shields.io/npm/v/@neosapience/typecast-js.svg)](https://www.npmjs.com/package/@neosapience/typecast-js)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-green.svg)](https://nodejs.org/)

The official Node.js library for the [Typecast API](https://typecast.ai). Convert text to lifelike speech using AI-powered voices.

Works with both JavaScript and TypeScript. Full TypeScript types included.

ESM & CommonJS supported. Works in Node.js and browser environments.

## Installation

```bash
npm install @neosapience/typecast-js
```

### Node.js 16/17 Users

This SDK uses the native `fetch` API. Node.js 18+ has built-in fetch support, but if you're using Node.js 16 or 17, you need to install a fetch polyfill:

```bash
npm install isomorphic-fetch
```

Then import it once at your application's entry point (before using the SDK):

```javascript
// At the top of your main file
import 'isomorphic-fetch';
// or for CommonJS
require('isomorphic-fetch');
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

- 🎙️ **Multiple Voice Models**: Support for ssfm-v21 and ssfm-v30 AI voice models
- 🌍 **Multi-language Support**: 37 languages including English, Korean, Spanish, Japanese, Chinese, and more
- 😊 **Emotion Control**: Preset emotions (happy, sad, angry, whisper, toneup, tonedown) or smart context-aware inference
- 🎚️ **Audio Customization**: Control volume (0-200), pitch (-12 to +12 semitones), tempo (0.5x to 2.0x), and format (WAV/MP3)
- 🔍 **Voice Discovery**: V2 API with filtering by model, gender, age, and use cases
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
// V2 API (recommended) - Enhanced metadata with filtering
const voices = await client.getVoicesV2();

// Filter by model, gender, age, or use case
const filteredVoices = await client.getVoicesV2({
  model: 'ssfm-v30',
  gender: 'female',
  age: 'young_adult'
});

// Each voice shows supported models and emotions
console.log(`Voice: ${voices[0].voice_name}`);
console.log(`Gender: ${voices[0].gender}, Age: ${voices[0].age}`);
console.log(`Models: ${voices[0].models.map(m => m.version).join(', ')}`);

// V1 API (legacy)
const v21Voices = await client.getVoices("ssfm-v21");
```

### ssfm-v30 Model Features

The ssfm-v30 model offers enhanced emotion control with two modes:

#### Preset Emotion Control

```typescript
import { PresetPrompt } from '@neosapience/typecast-js';

const audio = await client.textToSpeech({
  text: "I'm so happy to meet you!",
  voice_id: "tc_672c5f5ce59fac2a48faeaee",
  model: "ssfm-v30",
  language: "eng",
  prompt: {
    emotion_type: "preset",
    emotion_preset: "happy",     // normal, happy, sad, angry, whisper, toneup, tonedown
    emotion_intensity: 1.5
  } as PresetPrompt
});
```

#### Smart Context-Aware Emotion

Let the AI infer emotion from surrounding context:

```typescript
import { SmartPrompt } from '@neosapience/typecast-js';

const audio = await client.textToSpeech({
  text: "Everything is so incredibly perfect.",
  voice_id: "tc_672c5f5ce59fac2a48faeaee",
  model: "ssfm-v30",
  language: "eng",
  prompt: {
    emotion_type: "smart",
    previous_text: "I just got the best news ever!",
    next_text: "I cannot wait to share this with everyone!"
  } as SmartPrompt
});
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

The SDK supports 37 languages with automatic language detection:

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
| ben  | Bengali    | hin  | Hindi      | hun  | Hungarian  |
| nan  | Hokkien    | nor  | Norwegian  | pan  | Punjabi    |
| tha  | Thai       | tur  | Turkish    | vie  | Vietnamese |
| yue  | Cantonese  |      |            |      |            |

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
