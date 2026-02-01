// File: app/api/ai-task/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // LOG INI AKAN MUNCUL DI TERMINAL NEXT.JS (VS CODE)
    console.log("⚡ DATA DITERIMA DARI TELEGRAM:", body);

    // --- DI SINI NANTI KITA SIMPAN KE DATABASE ---
    // Contoh simulasi sukses:
    return NextResponse.json({ 
      success: true, 
      message: "Task berhasil diterima dashboard!",
      data: body 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memproses data" }, { status: 500 });
  }
}