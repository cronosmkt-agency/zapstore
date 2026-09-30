import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Shield, CheckCircle2, FileText } from 'lucide-react';

export const Route = createFileRoute('/termos-de-uso')({
  component: TermosDeUsoPage,
});

function TermosDeUsoPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-3">
              <FileText size={14} />
              <span>Documento Legal Oficial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Termos de Uso e Serviço
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Última atualização: 30 de Setembro de 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" />
                1. Objeto e Aceitação
              </h2>
              <p>
                Bem-vindo à <strong>ZapStore</strong>. Ao criar uma conta, utilizar nosso software como serviço (SaaS), hospedar um catálogo digital ou acessar qualquer recurso da plataforma, você concorda expressamente em vincular-se a estes Termos de Uso e a todas as leis e regulamentos aplicáveis.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" />
                2. Descrição do Serviço
              </h2>
              <p>
                A ZapStore disponibiliza ferramentas tecnológicas para que lojistas e empreendedores criem catálogos online de produtos ou serviços com direcionamento de pedidos diretamente para o WhatsApp do lojista. A ZapStore <strong>não</strong> é parte das transações comerciais entre lojistas e consumidores finais, atuando estritamente como provedora da infraestrutura de software.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" />
                3. Responsabilidades do Lojista
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Garantir a veracidade, qualidade e legalidade dos produtos cadastrados;</li>
                <li>Cumprir todas as obrigações do Código de Defesa do Consumidor perante seus clientes;</li>
                <li>Manter as informações de contato e preços sempre atualizados;</li>
                <li>Não comercializar produtos ilícitos, falsificados ou que infrinjam direitos autorais.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" />
                4. Planos, Mensalidades e Cancelamento
              </h2>
              <p>
                A ZapStore oferece planos Grátis, Starter e Pro. As assinaturas pagas são renovadas periodicamente e podem ser canceladas a qualquer momento pelo painel administrativo, sem fidelidade ou multas rescisórias, preservando o acesso até o término do ciclo já quitado.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" />
                5. Disponibilidade e SLA
              </h2>
              <p>
                Empenhamo-nos em manter a plataforma disponível 24 horas por dia, 7 dias por semana, com infraestrutura de nuvem resiliente e CDN global de alta velocidade, admitindo eventuais manutenções preventivas devidamente comunicadas aos usuários.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Shield size={18} className="text-blue-600" />
                6. Foro e Legislação Aplicável
              </h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil, em conformidade com o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </section>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/politica-de-privacidade"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Ver Política de Privacidade →
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
