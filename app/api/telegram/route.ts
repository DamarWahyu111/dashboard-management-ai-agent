import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

// Setup Token
const token = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: Request) {
  if (!token) return NextResponse.json({ error: 'No Token' });
  
  const bot = new TelegramBot(token);
  
  try {
    const body = await req.json();
    
    // Validasi payload
    if (!body.message || !body.message.text) {
        return NextResponse.json({ status: 'ignored' });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.toLowerCase(); 

    console.log("📩 Pesan masuk:", text); // Cek Logs Vercel nanti

    let responseText = "";

    // --- LOGIKA SKENARIO DEMO ---
    if (text.match(/halo|hi|start|pagi/)) {
        responseText = "Halo! Saya Watson Assistant.\nAda yang bisa saya bantu terkait jadwal atau manajemen proyek?";
    }
    else if (text.includes("meeting") || text.includes("jadwal")) {
        responseText = "Apakah Anda ingin membuat jadwal meeting baru?";
    }
    else if (text.includes("buat") || text.includes("iya") || text.includes("create")) {
        responseText = "Baik. Tolong berikan detailnya:\n\n[Peserta], [Judul Meeting], [Prioritas]";
    }
    else if (text.includes("deadline") || text.includes("ibm") || text.includes("high")) {
        await bot.sendChatAction(chatId, 'typing');
        await new Promise(resolve => setTimeout(resolve, 1500));
        responseText = `✅ **Jadwal Berhasil Dibuat!**\n\n📌 **Agenda:** IBM Hackathon Deadline\n👤 **Peserta:** Adnan (Owner)\n🔥 **Prioritas:** High\n📅 **Due Date:** Besok, 09:00 WIB`;
    }
    else {
        responseText = "Maaf, saya tidak mengerti. Coba ketik 'Halo' atau 'Buat Meeting'.";
    }

    await bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });

    return NextResponse.json({ status: 'ok' });

  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json({ status: 'error' });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Scripted Bot Ready' });
}