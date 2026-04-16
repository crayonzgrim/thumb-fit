import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const DEFAULT_BACKGROUND_EXTENSION_PROMPT = [
  'Extend only the missing background outside the original image.',
  'Preserve the original image content exactly as-is.',
  'Do not crop, redraw, alter, or replace the subject, text, logos, or any elements inside the original image.',
  'Generate content only for the masked empty area as a seamless continuation of the existing background.',
  'Match perspective, lighting, texture, depth, and colors naturally.',
].join(' ');

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, maskUrl, prompt } = await request.json();

    if (!imageUrl || !maskUrl) {
      return NextResponse.json(
        { error: 'Missing imageUrl or maskUrl' },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
      useFileOutput: false,
    });

    const output = await replicate.run('black-forest-labs/flux-fill-pro', {
      input: {
        image: imageUrl,
        mask: maskUrl,
        prompt: prompt || DEFAULT_BACKGROUND_EXTENSION_PROMPT,
        output_format: 'jpg',
        prompt_upsampling: false,
      },
    });

    const generatedImageUrl = Array.isArray(output) ? output[0] : output;

    if (typeof generatedImageUrl !== 'string' || !generatedImageUrl) {
      throw new Error('Replicate did not return a valid image URL');
    }

    return NextResponse.json({
      imageUrl: generatedImageUrl,
      status: 'success',
    });
  } catch (error) {
    console.error('Background generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate background' },
      { status: 500 }
    );
  }
}
