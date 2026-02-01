import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import dotenv from 'dotenv';
import path from 'path';

// Load Env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const watsonx = new WatsonXAI({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_WATSONX_APIKEY || '',
  }),
  serviceUrl: process.env.IBM_WATSONX_URL,
  version: '2023-05-29',
});

async function listModels() {
  console.log("🔍 Sedang mengecek daftar model yang tersedia...");
  try {
    const response = await watsonx.listFoundationModelSpecs({
        limit: 50 // Ambil 50 model pertama
    });
    
    console.log("\n✅ DAFTAR MODEL YANG BISA DIPAKAI DI AKUNMU:");
    console.log("=============================================");
    const models = response.result.resources;
    
    if (models) {
        models.forEach((m: { model_id?: string; [key: string]: unknown }) => {
            // Kita hanya cari model tipe 'generate' (bukan embedding)
            if(m.model_id && (m.model_id.includes('llama') || m.model_id.includes('flan') || m.model_id.includes('granite'))) {
                 console.log(`👉 ${m.model_id}`);
            }
        });
    }
    console.log("=============================================");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("❌ Gagal mengambil list model:", errorMessage);
  }
}

listModels();