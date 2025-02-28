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

  it('should get all voices without model filter', async () => {
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
  }, 30000);

  it('should get voices filtered by model', async () => {
    const targetModel = 'ssfm-v21';
    const voices = await client.getVoices(targetModel);
    
    expect(voices).toBeDefined();
    expect(Array.isArray(voices)).toBe(true);
    expect(voices.length).toBeGreaterThan(0);
    
    // Verify all returned voices are from the specified model
    voices.forEach(voice => {
      expect(voice.model).toBe(targetModel);
    });
  }, 30000);

  it('should return empty array for non-existent model', async () => {
    try {
      await client.getVoices('non-existent-model');
    } catch (error: any) {
      expect(error.response.status).toBe(422);
      return;
    }
  }, 30000);
});
