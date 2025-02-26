# Typecast SDK

A Node.js SDK for Typecast API integration.

## Installation

```bash
npm install typecast-sdk
```

## Quick Start

```typescript
import { TypecastClient } from 'typecast-sdk';
import fs from 'fs';

// Initialize client
const client = new TypecastClient({
    apiKey: 'YOUR_API_KEY'
});

// Convert text to speech
const audio = await client.textToSpeech({
    text: "Hello there!",
    model: "ssfm-v21",
    voice_id: "tc_123456789"
});

// Save audio file
await fs.promises.writeFile('typecast.wav', Buffer.from(audio));
```

## License

MIT License