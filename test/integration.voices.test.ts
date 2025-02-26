import dotenv from 'dotenv';
import { TypecastClient } from '../src/client';
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
    expect(voices).toBeDefined();
    expect(Array.isArray(voices)).toBe(true);
    expect(voices.length).toBeGreaterThan(0);

    // Check voice object structure
    const voice = voices[0];
    expect(voice).toHaveProperty('voice_name');
    expect(voice).toHaveProperty('voice_id');
    expect(voice).toHaveProperty('model');
    expect(voice).toHaveProperty('emotions');

    // later
    // expect(response.duration).toBeGreaterThan(0);
  }, 30000); // Increase timeout to 30 seconds for API call
});
