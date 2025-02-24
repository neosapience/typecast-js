import axios from 'axios';
import { TypecastClient } from '../src/client';

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
        baseHost: 'https://api.icepeak.ai',
      apiKey: 'test-api-key'
    });
  });

  it('textToSpeech should successfully convert text to speech', async () => {
    // Setup mock response
    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: Buffer.from('fake audio data'),
      headers: {
        'x-audio-duration': '1.5',
        'content-type': 'audio/wav'
      }
    });

    const request = {
      text: 'Hello',
      character_id: 'default',
      model: 'ssfm-v2.1'
    };

    const response = await client.textToSpeech(request);
    
    expect(response.duration).toBeGreaterThan(0);
    expect(response.format).toBe('wav');
    expect(response.audioData).toBeTruthy();
  });
}); 