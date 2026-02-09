import { NextResponse } from 'next/server';
import { botState, connectWhatsApp } from '@/lib/whatsapp';

export async function POST(req: Request) {
    const body = await req.json();
    const { testNumber, action } = body;

    if (action === "check-status") {
        return NextResponse.json({
            status: botState.status,
            qr: botState.qr,
            activeSessions: botState.userSessions.size
        });
    }

    if (action === "reset-session") {
        botState.userSessions.clear();
        return NextResponse.json({ message: "Sessões limpas." });
    }

    // Inicia a conexão
    connectWhatsApp(testNumber);

    return NextResponse.json({ message: "Iniciando processo..." });
}