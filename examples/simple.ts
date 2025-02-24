import { TypecastClient } from 'typecastsdk';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function main() {
  const client = new TypecastClient({
    baseHost: process.env.TYPECAST_API_HOST!,
    apiKey: process.env.TYPECAST_API_KEY!
  });
  const request = {
    text: "안녕하세요. 오늘은 맑은 날씨입니다.",
    character_id: "default",
    model: "ssfm-v2.1"
  };
  
  try {
    const response = await client.textToSpeech(request);
    
    await fs.promises.writeFile('output.wav', Buffer.from(response.audioData));
    console.log('Audio file saved as output.wav');
  } catch (error) {
    console.error('TTS request failed:', error);
  }
}

main();