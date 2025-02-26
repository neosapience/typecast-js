import { TypecastClient } from 'typecast-sdk';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function main() {
  const client = new TypecastClient({
    baseHost: process.env.TYPECAST_API_HOST!,
    apiKey: process.env.TYPECAST_API_KEY!
  });

  const target_model = 'ssfm-v21';
  const voices = await client.getVoices();
  const voice = voices.filter((voice) => voice.model === target_model)[0];
  
  const request = {
    text: "안녕하세요. 오늘은 맑은 날씨입니다.",
    voice_id: voice.voice_id,
    model: voice.model
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