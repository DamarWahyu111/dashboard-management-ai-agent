import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

// Pastikan token ada
const token = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: Request) {
  if (!token) {
    return NextResponse.json({ error: 'Telegram Token not found' }, { status: 500 });
  }

  // Inisialisasi Bot tanpa polling (mode Webhook)
  const bot = new TelegramBot(token);

  try {
    const body = await req.json();

    // Cek apakah ada pesan teks
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text.toLowerCase();
      const userName = body.message.from.first_name || 'User';

      console.log(`📩 Incoming from ${userName}: ${text}`);

      let responseText = '';

      // --- LOGIKA "AI AGENT" (Skenario Demo) ---
      
      // 1. Sapaan
      if (text.match(/hi|hello|halo|selamat|pagi|siang|sore/)) {
        responseText = `Halo ${userName}! 👋\nSaya **Watson Assistant**, asisten dashboard korporat Anda.\n\nApa yang bisa saya bantu hari ini?\n• _Cek Data Sales_\n• _Jadwalkan Meeting_\n• _Status Proyek XYZ_`;
      }
      
      // 2. Agent: Analyst (Cek Sales)
      else if (text.includes('sales') || text.includes('penjualan')) {
        // Simulasi "Thinking process"
        await bot.sendChatAction(chatId, 'typing');
        
        responseText = `📊 **Laporan Penjualan Bulan Ini**\n\nTotal Revenue: **$45,230** (Naik 12% 📈)\nTop Product: **Enterprise AI Subscription**\n\n_Data diambil real-time dari Dashboard Sales._`;
      }
      
      // 3. Agent: Scheduler (Meeting)
      else if (text.includes('meeting') || text.includes('jadwal') || text.includes('kalender')) {
        await bot.sendChatAction(chatId, 'typing');
        
        // Simulasi cek slot kosong
        responseText = `✅ **Meeting Dijadwalkan**\n\nTopik: Review Q3 Strategy\nWaktu: **Besok, 10:00 AM**\nDurasi: 1 Jam\nMelalui: Google Meet\n\n_Undangan telah dikirim ke email tim._`;
      }
      
      // 4. Agent: Project Manager (Status Proyek)
      else if (text.includes('proyek') || text.includes('project') || text.includes('xyz')) {
        await bot.sendChatAction(chatId, 'typing');
        
        responseText = `🏗️ **Status Proyek XYZ**\n\nProgress: **75%** (On-Track)\nDeadline: 15 Oktober 2024\nBlocker: Menunggu approval budget marketing.\n\n_Apakah Anda ingin saya mengirim reminder ke Finance?_`;
      }
      
      // 5. Fallback (Gak ngerti)
      else {
        responseText = `Maaf, saya belum mengerti perintah tersebut. Coba kata kunci: "Sales", "Meeting", atau "Proyek".`;
      }

      // Kirim Balasan
      await bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Telegram Error:', error);
    // Tetap return 200 supaya Telegram tidak mengulang request terus menerus
    return NextResponse.json({ status: 'error', message: error }, { status: 200 });
  }
}

// Endpoint cek status (biar tau jalan/nggak)
export async function GET() {
  return NextResponse.json({ 
    status: 'Active', 
    mode: 'Webhook',
    time: new Date().toISOString() 
  });
}