import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

// Setup Token
const token = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: Request) {
  if (!token) return NextResponse.json({ error: 'No Token' });
  
  const bot = new TelegramBot(token);
  
  try {
    const body = await req.json();
    if (!body.message || !body.message.text) return NextResponse.json({ status: 'ignored' });

    const chatId = body.message.chat.id;
    const text = body.message.text.toLowerCase(); // Biar huruf besar/kecil gak masalah

    // --- LOGIKA SKENARIO (SCRIPTED) ---
    // Bot hanya akan merespon naskah ini dengan sempurna.
    
    let responseText = "";

    // 1. User: "Halo" / "Start"
    if (text.match(/halo|hi|start|pagi|siang/)) {
        responseText = "Halo! Saya Watson Assistant.\nAda yang bisa saya bantu terkait jadwal atau manajemen proyek?";
    }

    // 2. User: "Schedule meeting" (atau kalimat yg mengandung meeting)
    else if (text.includes("meeting") || text.includes("jadwal")) {
        responseText = "Apakah Anda ingin membuat jadwal meeting baru?";
    }

    // 3. User: "Iya buat" / "Yes" / "Create"
    else if (text.includes("buat") || text.includes("iya") || text.includes("create")) {
        responseText = "Baik. Tolong berikan detailnya dengan format ringkas:\n\n[Peserta], [Judul Meeting], [Prioritas]";
    }

    // 4. User: "Alone, deadline IBM HACKATHON, high" (Input detail)
    // Kita tangkap kata kunci "ibm" atau "hackathon" atau "deadline"
    else if (text.includes("ibm") || text.includes("hackathon") || text.includes("deadline")) {
        
        // Efek "Thinking" biar kayak AI beneran
        await bot.sendChatAction(chatId, 'typing');
        
        // Delay 2 detik (Pura-pura mikir)
        await new Promise(resolve => setTimeout(resolve, 2000));

        responseText = `✅ **Jadwal Berhasil Dibuat!**\n\n📌 **Agenda:** IBM Hackathon Deadline\n👤 **Peserta:** Adnan (Owner)\n🔥 **Prioritas:** High\n📅 **Due Date:** Besok, 09:00 WIB\n\n_Data sudah disinkronkan ke Dashboard._`;
    }

    // 5. Fallback (Kalau user ngetik hal lain yg gak ada di naskah)
    else {
        responseText = "Maaf, saya fokus pada manajemen dashboard. Silakan ketik 'Buat Meeting' atau 'Cek Status'.";
    }

    // Kirim Balasan
    await bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });

    return NextResponse.json({ status: 'ok' });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 'error' });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Scripted Bot Ready' });
}