import dotenv from 'dotenv';
import { TypecastClient } from '../src/client';
import { TTSModel } from '../src/types/TextToSpeech';
import fs from 'fs';
// Load environment variables from .env file
dotenv.config();

describe('TypecastClient Integration', () => {
  let client: TypecastClient;

  beforeEach(() => {
    // Create real client instance without mocking
    client = new TypecastClient();
  });

  it('should convert text to speech with real API', async () => {
    const voices = await client.getVoices();
    const voice = voices.filter((voice) => voice.model === 'ssfm-v21')[0];

    const request = {
      text: '안녕하세요',
      voice_id: voice.voice_id,
      model: voice.model as TTSModel,
      prompt: {
        emotion_preset: 'normal' as const,
        speed: 1.0
      },
      output: {
        audio_format: 'wav' as const
      }
    };

    const response = await client.textToSpeech(request);

    // Verify the response from real API
    expect(response.format).toBe('wav');
    expect(response.audioData).toBeInstanceOf(Buffer);
    expect(response.audioData.byteLength).toBeGreaterThan(0);

    // Write audio file to disk for manual verification
    const outputPath = './test-output.wav';
    await fs.promises.writeFile(outputPath, Buffer.from(response.audioData));
    expect(fs.existsSync(outputPath)).toBe(true);

    // later
    // expect(response.duration).toBeGreaterThan(0);
  }, 30000); // Increase timeout to 30 seconds for API call
});
