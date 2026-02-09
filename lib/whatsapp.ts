import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    WAMessage
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import axios from 'axios';

export const botState = {
    sock: null as any,
    qr: null as string | null,
    status: "DISCONNECTED",
    testNumber: "",
    userSessions: new Map<string, any>(),
};

// URL do seu Webhook no n8n (Troque pela sua URL de produção ou teste)
const N8N_WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL_HERE";

export async function connectWhatsApp(testNumber?: string) {
    if (testNumber) botState.testNumber = testNumber;
    if (botState.status === "CONNECTED" || botState.status === "CONNECTING") return;

    botState.status = "CONNECTING";
    const { state, saveCreds } = await useMultiFileAuthState('auth_tokens');

    const sock = makeWASocket({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: ["Mac OS", "Chrome", "110.0.5481.100"],
        logger: pino({ level: 'silent' }),
    });

    botState.sock = sock;

    sock.ev.on('connection.update', async (update) => {
        const { qr, connection, lastDisconnect } = update;
        if (qr) {
            botState.qr = await QRCode.toDataURL(qr);
            botState.status = "WAITING_QR";
        }
        if (connection === 'open') {
            botState.status = "CONNECTED";
            botState.qr = null;
            console.log("✅ WHATSAPP CONECTADO - MODO IA (n8n)");
        }
        if (connection === 'close') {
            botState.status = "DISCONNECTED";
            const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectWhatsApp();
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const remoteJid = m.key.remoteJid!;
        const from = remoteJid.split('@')[0];

        // Bloqueio de grupos e filtro de número de teste
        if (remoteJid.endsWith('@g.us') || (botState.testNumber && from !== botState.testNumber)) return;

        // Extrai o texto da mensagem
        const messageText = m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            "";

        if (!messageText) return;

        // Mostra "digitando..." para o usuário
        await sock.sendPresenceUpdate('composing', remoteJid);

        try {
            const response = await axios.post(N8N_WEBHOOK_URL, {
                sender: remoteJid,
                pushName: m.pushName || "Cliente",
                message: messageText
            });

            // CORREÇÃO AQUI: Garantir que pegamos o texto de dentro do JSON
            // Tentamos pegar 'reply', se não existir tentamos 'output'
            const replyText = response.data?.reply || response.data?.output;

            if (replyText) {
                await sock.sendMessage(remoteJid, { text: replyText });
            } else {
                console.error("n8n retornou um JSON sem o campo esperado:", response.data);
            }
        } catch (error) {
            console.error("Erro na comunicação com n8n:", error);
        }
    });
}