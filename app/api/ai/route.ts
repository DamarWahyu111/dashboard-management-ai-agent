import { NextResponse } from 'next/server';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt wajib diisi' },
        { status: 400 }
      );
    }

    // ✅ PINDAHKAN KE DALAM FUNCTION
    const watsonx = new WatsonXAI({
      authenticator: new IamAuthenticator({
        apikey: process.env.IBM_WATSONX_APIKEY!,
      }),
      serviceUrl: process.env.IBM_WATSONX_URL!,
      version: '2023-05-29',
    });

    const modelId = 'google/flan-t5-xxl';

    const params = {
      input: `Jawab pertanyaan berikut dengan ringkas.\nUser: ${prompt}\nAssistant:`,
      modelId,
      projectId: process.env.IBM_WATSONX_PROJECT_ID!,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 200,
        min_new_tokens: 1,
        repetition_penalty: 1.0,
      },
    };

    const response = await watsonx.generateText(params);
    const generatedText =
      response.result.results?.[0]?.generated_text ?? '';

    return NextResponse.json({ result: generatedText });

  } catch (error: any) {
    console.error("❌ Watsonx Error:", error);

    return NextResponse.json(
      { error: error.message || "Gagal menghubungi AI" },
      { status: 500 }
    );
  }
}
