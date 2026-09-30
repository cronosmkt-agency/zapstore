import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Shield, Lock, Eye, Server } from 'lucide-react';

export const Route = createFileRoute('/politica-de-privacidade')({
  component: PoliticaDePrivacidadePage,
});

function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/zapstore-logo.png"
              alt="ZapStore"
              className="w-8 h-8 rounded-xl object-contain drop-shadow-xs"
            />
            <span className="font-black text-lg text-slate-900 tracking-tight">
              Zap<span className="text-blue-600">Store</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao início</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold mb-3">
              <Shield size={14} />
              <span>Conformidade LGPD (Lei nº 13.709/2018)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Política de Privacidade
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Última atualização: 30 de Setembro de 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Lock size={18} className="text-emerald-600" />
                1. Compromisso com a sua Privacidade
              </h2>
              <p>
                A <strong>ZapStore</strong> valoriza e respeita a privacidade de todos os seus usuários e lojistas. Esta Política esclarece de forma transparente como coletamos, armazenamos, utilizamos e protegemos seus dados pessoais ao utilizar nossa plataforma.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Eye size={18} className="text-emerald-600" />
                2. Dados Coletados
              </h2>
              <p>Coletamos apenas as informações estritamente necessárias para o funcionamento do serviço:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Dados de Cadastro:</strong> Nome completo, endereço de e-mail, número de telefone/WhatsApp e dados da loja;</li>
                <li><strong>Dados de Uso:</strong> Registro de acessos, endereço IP, tipo de navegador e preferências de tema;</li>
                <li><strong>Dados do Catálogo:</strong> Fotos, títulos, descrições e valores dos itens cadastrados.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Server size={18} className="text-emerald-600" />
                3. Finalidade e Compartilhamento
              </h2>
              <p>
                Os dados são utilizados unicamente para viabilizar as funcionalidades da plataforma, gerenciar sua conta, emitir faturas e enviar notificações essenciais. A ZapStore <strong>jamais comercializa</strong> seus dados com terceiros.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Shield size={18} className="text-emerald-600" />
                4. Segurança e Armazenamento
              </h2>
              <p>
                Seus dados são transmitidos mediante conexões criptografadas de ponta a ponta (HTTPS/TLS) e mantidos em servidores de nuvem de padrão corporativo, protegidos por firewalls e rotinas contínuas de segurança.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Lock size={18} className="text-emerald-600" />
                5. Seus Direitos como Titular dos Dados
              </h2>
              <p>
                Em conformidade com a LGPD, você tem o direito de solicitar a qualquer momento a confirmação de tratamento, acesso aos seus dados, correção de inconsistências ou exclusão definitiva de sua conta e informações.
              </p>
            </section>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/termos-de-uso"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Ver Termos de Uso →
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
