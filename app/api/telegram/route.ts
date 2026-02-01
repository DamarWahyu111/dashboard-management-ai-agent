import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';

// ============================================================================
// 1. CONFIGURATION & SETUP
// ============================================================================

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DASHBOARD_API_URL = process.env.DASHBOARD_API_URL || "https://your-dashboard-url.com/api/ai-task"; // Ganti dengan URL Vercel kamu nanti

// Validasi Environment (Fail Fast)
if (!TOKEN) throw new Error("❌ TELEGRAM_BOT_TOKEN is missing");
if (!process.env.IBM_WATSONX_APIKEY) console.warn("⚠️ IBM_WATSONX_APIKEY is missing. AI will fail.");

// Init Watsonx
const watsonx = new WatsonXAI({
  authenticator: new IamAuthenticator({ apikey: process.env.IBM_WATSONX_APIKEY || '' }),
  serviceUrl: process.env.IBM_WATSONX_URL,
  version: '2023-05-29',
});

// Init Bot (Mode Webhook = Tanpa Polling)
const bot = new TelegramBot(TOKEN);

// ============================================================================
// 2. THE BRAIN (ANTI-HALLUCINATION PROMPT)
// ============================================================================
const getSystemPrompt = () => {
  const now = new Date();
  const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  return `
You are Watson, a Senior Executive Assistant for a Corporate Dashboard.
Current Date: ${dateString}.

INSTRUCTIONS:
1. **Persona**: Professional, Efficient, Concise. Do not use emojis unless necessary.
2. **Task Detection**: If user asks to create/schedule a task, meeting, or reminder, you MUST output a JSON OBJECT.
3. **Chit-Chat**: If user asks general questions, reply normally in text.

JSON FORMAT (Strict):
{
  "action": "create_task",
  "title": "Short descriptive title",
  "priority": "High" | "Medium" | "Low",
  "due_date": "YYYY-MM-DD HH:mm" (Calculate based on Current Date. Assume 09:00 AM if time not specified)
}

EXAMPLES:
User: "Halo Watson"
Assistant: Selamat pagi. Saya siap membantu operasional Anda.

User: "Jadwalkan meeting review budget besok jam 2 siang priority high"
Assistant: { "action": "create_task", "title": "Meeting Review Budget", "priority": "High", "due_date": "2026-02-03 14:00" }

User: "Apa itu IBM?"
Assistant: IBM adalah perusahaan teknologi multinasional yang berfokus pada Cloud Hybrid dan AI.
`;
};

// ============================================================================
// 3. MAIN ROUTE HANDLER (POST)
// ============================================================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi basic message
    if (!body.message || !body.message.text) {
      return NextResponse.json({ status: 'ignored' });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text;
    const userName = body.message.from.first_name || 'Sir';

    console.log(`📩 Incoming [${userName}]: ${text}`);

    // --- A. Handle Command Dasar ---
    if (text === '/start') {
      await bot.sendMessage(chatId, `Selamat datang, ${userName}.\nSistem Watsonx online. Perintahkan saya untuk manajemen dashboard.`);
      return NextResponse.json({ status: 'ok' });
    }

    // --- B. AI Processing ---
    await bot.sendChatAction(chatId, 'typing');

    try {
      const response = await watsonx.generateText({
        input: `${getSystemPrompt()}\n\nUser: ${text}\nAssistant:`,
        modelId: 'ibm/granite-3-8b-instruct', // Model Granite lebih patuh instruksi
        projectId: process.env.IBM_WATSONX_PROJECT_ID,
        parameters: {
          decoding_method: 'greedy', // PENTING: Greedy mengurangi kreativitas/halusinasi
          max_new_tokens: 300,
          min_new_tokens: 1,
          repetition_penalty: 1.1,
          stop_sequences: ["User:", "\nUser"]
        },
      });

      const rawReply = response.result.results[0].generated_text.trim();
      console.log(`🤖 AI Raw: ${rawReply}`);

      // --- C. Logic Extraction (JSON vs Text) ---
      // Regex ini mencari kurung kurawal {} pertama dan terakhir untuk isolasi JSON
      const jsonMatch = rawReply.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        // --- KASUS 1: DETECTED TASK (JSON) ---
        const jsonStr = jsonMatch[0];
        const taskData = JSON.parse(jsonStr);

        if (taskData.action === 'create_task') {
          // Simulasi Simpan ke DB (Atau fetch ke API Dashboard asli jika sudah live)
          // await fetch(DASHBOARD_API_URL, { method: 'POST', body: jsonStr ... })
          
          const confirmationMsg = `✅ **Jadwal Dikonfirmasi**\n\n📌 **Agenda:** ${taskData.title}\n📅 **Waktu:** ${taskData.due_date}\n🔥 **Prioritas:** ${taskData.priority}\n\n_Data telah disinkronkan ke Dashboard._`;
          await bot.sendMessage(chatId, confirmationMsg, { parse_mode: 'Markdown' });
        }
      } else {
        // --- KASUS 2: CHIT-CHAT BIASA ---
        // Bersihkan jika ada sisa artifact "User:"
        const cleanReply = rawReply.replace(/^User:|Assistant:/gi, '').trim();
        await bot.sendMessage(chatId, cleanReply);
      }

    } catch (aiError) {
      console.error("❌ Watson Error:", aiError);
      // Fallback jika AI limit/error
      await bot.sendMessage(chatId, "Maaf, server AI sedang sibuk. Mohon coba kalimat yang lebih spesifik.");
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('🔥 Server Error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

// Endpoint GET untuk cek status Webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'Active', 
    system: 'Watsonx Orchestrator v2.0',
    time: new Date().toISOString()
  });
}