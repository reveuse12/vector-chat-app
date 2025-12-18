/**
 * Test AI Route - for debugging
 */

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function GET() {
  try {
    const result = await generateText({
      model: google('gemini-2.0-flash'),
      prompt: 'Say hello in one sentence.',
    });

    return Response.json({ 
      success: true,
      model: 'gemini-2.0-flash',
      text: result.text 
    });
  } catch (error) {
    console.error('AI Test Error:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
