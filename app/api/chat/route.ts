import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Pass the API key explicitly
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash', // Using the stable model identifier
      contents: prompt,
      config: {
        systemInstruction:
          'You are PhantomBot, the official AI assistant for Phantoms FC football club (phantomsfc26.vercel.app). Help players with football advice, club rules, training tips, and match prep concisely.',
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Detailed AI Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate response from PhantomBot' },
      { status: 500 }
    );
  }
}