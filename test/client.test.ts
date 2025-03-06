import axios from 'axios';
import { TypecastClient } from '../src/client';
import { TTSModel } from '../src/types/TextToSpeech';

// Mock axios
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('TypecastClient', () => {
  let client: TypecastClient;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup axios create mock
    mockedAxios.create.mockReturnValue(mockedAxios);

    client = new TypecastClient({
      baseHost: 'https://dummy-api.ai',
      apiKey: 'test-api-key',
    });
  });

  it('textToSpeech should successfully convert text to speech', async () => {
    // Setup mock response
    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: Buffer.from('fake audio data'),
      headers: {
        'x-audio-duration': '1.5',
        'content-type': 'audio/wav',
      },
    });

    const request = {
      text: 'Hello',
      voice_id: 'default',
      model: 'ssfm-v21' as TTSModel,
      language: 'ko',
      seed: 12345,
      prompt: {
        emotion_preset: 'normal' as const,
        emotion_intensity: 1.0,
        speed: 1.2,
        intonation: 1,
      },
      output: {
        volume: 100,
        audio_pitch: 0,
        audio_tempo: 1.0,
        audio_format: 'wav' as const,
      },
    };

    const response = await client.textToSpeech(request);

    expect(response.duration).toBeGreaterThan(0);
    expect(response.format).toBe('wav');
    expect(response.audioData).toBeTruthy();
  });
});
