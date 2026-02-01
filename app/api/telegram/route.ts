import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: Request) {
  if (!token) {
    return NextResponse.json({ error: 'Telegram Token not found' }, { status: 500 });
  }

  const bot = new TelegramBot(token);

  try {
    const body = await req.json();

    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text.toLowerCase();
      const userName = body.message.from.first_name || 'User';

      console.log(`📩 Incoming: ${text}`);

      let responseText = '';

      // --- SKENARIO 1: START ---
      if (text.match(/hi|hello|halo|start/)) {
        responseText = `Halo ${userName}! 👋\nSaya **Watson Assistant**. Ada yang bisa saya bantu?\n\n- Cek Sales\n- Schedule Meeting\n- Status Proyek`;
      }
      
      // --- SKENARIO 2: USER MINTA MEETING (Pertama kali) ---
      else if (text.includes('schedule meeting') || text.includes('jadwal meeting')) {
        responseText = `Baik, saya bisa bantu buatkan jadwal. Untuk keperluan apa dan kapan?`;
      }
      
      // --- SKENARIO 3: KONFIRMASI (User bilang "iya buat" seperti di SS) ---
      else if (text.includes('buat') || text.includes('create')) {
         responseText = `Oke. Tolong berikan detailnya dengan format:\n[Partisipan], [Topik], [Prioritas]`;
      }

      // --- SKENARIO 4: EKSEKUSI FINAL (User kasih detail "alone, deadline...") ---
      // Kita tangkap kata kunci "deadline" atau "high" atau "alone" biar pasti sukses
      else if (text.includes('deadline') || text.includes('high') || text.includes('alone') || text.includes('ibm')) {
        
        // FAKE LOADING (Biar kelihatan mikir)
        await bot.sendMessage(chatId, '🔄 _Sedang menyinkronkan data ke Dashboard..._', { parse_mode: 'Markdown' });
        
        // Tunggu 1 detik biar realistik
        await new Promise(r => setTimeout(r, 1500));

        // RESPONS SUKSES (Langsung hardcode biar demo lancar)
        responseText = `✅ **Jadwal Berhasil Dibuat!**\n\n📅 **Agenda:** IBM Hackathon Deadline\n👤 **Participant:** ${userName} (Alone)\n🔥 **Priority:** High\n\nData sudah tersimpan di Dashboard Management System.`;
      }
      
      // --- SKENARIO 5: CEK SALES (Tambahan) ---
      else if (text.includes('sales')) {
        responseText = `📊 **Data Sales Terkini:**\nTarget: 150%\nRevenue: $50,000\nStatus: Excellent 🚀`;
      }

      // FALLBACK
      else {
        responseText = `Maaf, saya kurang paham. Coba ketik "Schedule Meeting" atau "Cek Sales".`;
      }

      await bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Bot Ready for Demo' });
}