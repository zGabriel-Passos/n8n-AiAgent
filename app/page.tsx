"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [testNumber, setTestNumber] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState('DESCONECTADO');
  const [showPanel, setShowPanel] = useState(false);

  // Polling: Pergunta ao servidor como o bot está a cada 2 segundos
  useEffect(() => {
    const check = setInterval(async () => {
      const res = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        body: JSON.stringify({ action: 'check-status' })
      });
      const data = await res.json();

      setStatus(data.status);
      if (data.qr) setQrCode(data.qr);
      if (data.status === "CONNECTED") setQrCode(null);
    }, 2000);

    return () => clearInterval(check);
  }, []);

  const handleStart = async () => {
    setStatus("INICIANDO...");
    await fetch('/api/whatsapp/connect', {
      method: 'POST',
      body: JSON.stringify({ testNumber })
    });
  };

  if (showPanel) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Header */}
        <div className="border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              WhatsApp Bot
            </h1>
            <button
              onClick={() => setShowPanel(false)}
              className="text-slate-400 hover:text-white transition"
            >
              ← Voltar
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              Conectar Bot
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Número que a IA deve responder (Não deve ser o número que vai conectar.
                  <p>Apenas para testes com anti-spam)</p>
                </label>
                <input
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-500 focus:border-green-400 focus:outline-none transition"
                  placeholder="Número de teste (5511...)"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                />
              </div>

              <button
                onClick={handleStart}
                className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 active:scale-95"
              >
                🚀 Ligar Bot
              </button>
            </div>

            {/* Status Card */}
            <div className="mt-8 p-4 bg-slate-800 border border-slate-700 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Status Atual</p>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${status === 'CONNECTED' ? 'bg-green-400' :
                  status === 'INICIANDO...' ? 'bg-yellow-400 animate-pulse' :
                    'bg-red-400'
                  }`}></span>
                <span className="text-lg font-mono font-bold">{status}</span>
              </div>
            </div>

            {/* QR Code */}
            {qrCode && (
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400 mb-4">Escaneie o código QR para conectar:</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img src={qrCode} alt="QR Code" width={250} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-slate-800/50 backdrop-blur-md bg-slate-950/30">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <h1 className="text-2xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Project Bot
              </h1>
            </div>
            <span className="text-xs px-3 py-1 bg-green-400/20 text-green-400 rounded-full border border-green-400/30">
              Beta
            </span>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <div className="space-y-6">
              <div>
                <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                  Seu Bot <span className="bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">WhatsApp</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Automatize suas conversas no WhatsApp com inteligência e eficiência. Conecte-se em segundos e comece a escalar suas operações.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">✓</span>
                  <span className="text-slate-300">Configuração rápida</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">✓</span>
                  <span className="text-slate-300">Conexão segura via QR Code</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">✓</span>
                  <span className="text-slate-300">Monitoramento em tempo real</span>
                </div>
              </div>

              <button
                onClick={() => setShowPanel(true)}
                className="mt-8 px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-bold text-lg transition transform hover:scale-105 active:scale-95 shadow-lg shadow-green-600/50"
              >
                🚀 Começar Agora
              </button>
            </div>

            {/* Right side - Feature card */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 backdrop-blur-md">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">⚡</span>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Rápido</h3>
                      <p className="text-slate-400 text-sm">Conecte seu bot em menos de um minuto</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🔒</span>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Seguro</h3>
                      <p className="text-slate-400 text-sm">Autenticação segura com QR Code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">📊</span>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Inteligente</h3>
                      <p className="text-slate-400 text-sm">Acompanhe o status em tempo real</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-linear-to-r from-green-600/10 to-emerald-600/10 border border-green-600/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Pronto para começar?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Conexão segura e inteligência artificial para transformar seu atendimento no WhatsApp
            </p>
            <button
              onClick={() => setShowPanel(true)}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition transform hover:scale-105"
            >
              Acesse o Painel →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 mt-20 py-8 text-center text-slate-400">
          <p>© 2026 Project Bot. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}