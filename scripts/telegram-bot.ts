import TelegramBot from 'node-telegram-bot-api';
import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

// ============================================================================
// 1. CONFIGURATION & ENVIRONMENT SETUP
// ============================================================================

// Load .env.local jika ada (Untuk Local Development)
// Jika di Production (Railway/Vercel), config diambil dari System Environment
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

// Tentukan URL Dashboard Tujuan
// Jika ada env DASHBOARD_URL (dari Railway), pakai itu. Jika tidak, pakai localhost.
const RAW_URL = process.env.DASHBOARD_URL || "http://localhost:3000";
// Pastikan tidak ada slash di akhir URL sebelum digabung
const CLEAN_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;
const DASHBOARD_API_URL = `${CLEAN_URL}/api/ai-task`;

// Validasi Token
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error("❌ FATAL ERROR: TELEGRAM_BOT_TOKEN is missing.");
    process.exit(1);
}

// Konfigurasi AI Watsonx
const AI_CONFIG = {
    MODEL_ID: 'ibm/granite-3-8b-instruct',
    PROJECT_ID: process.env.IBM_WATSONX_PROJECT_ID,
    PARAMS: {
        decoding_method: 'greedy', // Greedy = Stabil & Patuh Instruksi
        max_new_tokens: 400,
        min_new_tokens: 1,
        repetition_penalty: 1.1,
        stop_sequences: ["User:", "\nUser"] // Mencegah AI halusinasi jadi User
    }
};

// Init Services
const watsonx = new WatsonXAI({
    authenticator: new IamAuthenticator({ apikey: process.env.IBM_WATSONX_APIKEY || '' }),
    serviceUrl: process.env.IBM_WATSONX_URL,
    version: '2023-05-29',
});

const bot = new TelegramBot(token, { polling: true });

console.log("==================================================");
console.log("🚀 SENIOR EXECUTIVE ASSISTANT IS ONLINE");
console.log(`📡 Target Dashboard: ${DASHBOARD_API_URL}`);
console.log("==================================================");

// ============================================================================
// 2. SYSTEM PROMPT (THE BRAIN)
// ============================================================================
const SYSTEM_PROMPT = `
You are "Watson", a Senior Executive Assistant integrated with a Corporate Dashboard.

RULES:
1. **Persona**: Professional, Efficient, Polite (Formal Indonesian/English).
2. **General Chat**: Reply normally to greetings or questions.
3. **Task Requests**: If the User asks to CREATE/SCHEDULE a task/meeting, you MUST output a JSON OBJECT ONLY.

JSON STRUCTURE FOR TASKS (Strictly follow this):
{
  "action": "create_task",
  "title": "Clear task title",
  "priority": "High" | "Medium" | "Low",
  "due_date": "YYYY-MM-DD HH:mm" (Assume tomorrow 09:00 if undefined)
}

---
Example 1 (Chat):
User: "Selamat pagi Watson"
Assistant: Selamat pagi, Pak. Ada agenda penting yang perlu saya catat hari ini?

Example 2 (Action):
User: "Buatkan jadwal meeting dengan Vendor IT besok jam 2 siang priority high"
Assistant: { "action": "create_task", "title": "Meeting dengan Vendor IT", "priority": "High", "due_date": "2026-02-02 14:00" }
---
`;

// ============================================================================
// 3. MAIN LOGIC HANDLER
// ============================================================================
bot.on('message', async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const senderName = msg.from?.first_name || 'Sir';

    if (!text) return;

    // Handle /start command
    if (text === '/start') {
        bot.sendMessage(chatId, `Selamat datang, ${senderName}.\nSaya Watson, asisten eksekutif Anda.\nSilakan perintahkan saya untuk mencatat tugas atau jadwal.`);
        return;
    }

    console.log(`📩 [${senderName}]: ${text}`);
    bot.sendChatAction(chatId, 'typing');

    try {
        // A. Generate AI Response
        const response = await watsonx.generateText({
            input: `${SYSTEM_PROMPT}\n\nUser: ${text}\nAssistant:`,
            modelId: AI_CONFIG.MODEL_ID,
            projectId: AI_CONFIG.PROJECT_ID,
            parameters: AI_CONFIG.PARAMS,
        });

        let reply = response.result.results[0].generated_text.trim();

        // B. Sanitasi Output (Hapus jika AI tidak sengaja menulis 'User:')
        if (reply.includes("User:")) {
            reply = reply.split("User:")[0].trim();
        }

        // C. LOGIC SPLIT: JSON vs CHAT
        // Cek apakah output mengandung format JSON action kita
        if (reply.includes('"action": "create_task"')) {
            console.log("⚙️  Processing Task Request...");

            try {
                // Ekstrak JSON murni (jaga-jaga ada teks nyasar)
                const jsonStartIndex = reply.indexOf('{');
                const jsonEndIndex = reply.lastIndexOf('}') + 1;
                const jsonString = reply.substring(jsonStartIndex, jsonEndIndex);
                
                const taskData = JSON.parse(jsonString);

                // Kirim Notifikasi "Sedang Proses"
                bot.sendMessage(chatId, "🔄 Sedang menyinkronkan data ke Dashboard...");

                // POST ke Dashboard API
                const apiResponse = await fetch(DASHBOARD_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });

                if (apiResponse.ok) {
                    bot.sendMessage(chatId, `✅ **Terkonfirmasi.**\n\n📌 Agenda: ${taskData.title}\n🕒 Waktu: ${taskData.due_date}\n⚡ Prioritas: ${taskData.priority}\n\nData berhasil disimpan ke sistem.`);
                    console.log(`✅ Success: Task "${taskData.title}" created.`);
                } else {
                    console.error(`❌ API Error: ${apiResponse.status} ${apiResponse.statusText}`);
                    bot.sendMessage(chatId, "⚠️ Gagal terhubung ke Dashboard. Pastikan website sedang online.");
                }

            } catch (err) {
                console.error("❌ JSON/Network Error:", err);
                bot.sendMessage(chatId, "Maaf Pak, saya gagal memproses data tersebut. Mohon ulangi perintah.");
            }

        } else {
            // D. Jika Obrolan Biasa -> Kirim langsung
            bot.sendMessage(chatId, reply);
            console.log(`🗣️ Reply: ${reply.substring(0, 40)}...`);
        }

    } catch (error: any) {
        console.error("❌ System Error:", error.message);
        bot.sendMessage(chatId, "Mohon maaf, sistem sedang mengalami gangguan koneksi. Silakan coba sesaat lagi.");
    }
});

// Handle Polling Error (Supaya tidak spam log di terminal production)
bot.on('polling_error', (error: any) => {
    if (error.code !== 'ETELEGRAM') {
        console.log(`⚠️ Connection Jitter: ${error.message}`);
    }
});