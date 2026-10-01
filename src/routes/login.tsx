import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/lib/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Eye,
  EyeOff,
  Loader2,
  Store,
  KeyRound,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Sparkles,
  Sun,
  Moon,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, refreshSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(true);
  const [filledAccount, setFilledAccount] = useState<string | null>(null);
  const [theme, setTheme] = useState<'white' | 'black-piano'>('white');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('zapstore_auth_theme');
      if (t === 'black-piano' || document.documentElement.classList.contains('theme-black-piano') || document.documentElement.classList.contains('dark')) {
        setTheme('black-piano');
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'black-piano' ? 'white' : 'black-piano';
    setTheme(next);
    localStorage.setItem('zapstore_auth_theme', next);
    const root = document.documentElement;
    root.classList.remove('theme-white', 'theme-black-piano', 'dark');
    if (next === 'black-piano') {
      root.classList.add('theme-black-piano', 'dark');
    } else {
      root.classList.add('theme-white');
    }
  };

  // Redirect if already logged in
  if (session) {
    navigate({ to: session.is_admin ? '/admin' : '/dashboard' });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.ok) {
        await refreshSession();
        toast.success('Login realizado com sucesso!');
        navigate({ to: result.session?.is_admin ? '/admin' : '/dashboard' });
      } else {
        setError(result.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (err) {
      setError('Erro inesperado ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const autofill = (em: string, pass: string, name: string) => {
    setEmail(em);
    setPassword(pass);
    setFilledAccount(name);
    setError(null);
  };

  const isDark = theme === 'black-piano';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden selection:bg-blue-600 selection:text-white ${
      isDark
        ? 'bg-[#06080d] text-slate-100'
        : 'bg-gradient-to-b from-slate-50 via-slate-100/90 to-slate-200/60 text-slate-900'
    }`}>
      {/* Ambient background glow in dark mode */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-0" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
        </>
      )}

      {/* Top back link & Theme Switch */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between relative z-10">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-blue-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Início</span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-xs transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-900/90 border-slate-700/80 text-amber-300 hover:bg-slate-800 hover:border-amber-400/50'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-300'
          }`}
          title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Black Piano'}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Black Piano</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-md space-y-5 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-1.5">
          <div className="relative">
            <img
              src="/zapstore-logo.png"
              alt="ZapStore"
              className={`w-14 h-14 rounded-2xl object-cover mb-1 transition-transform hover:scale-105 ${
                isDark
                  ? 'shadow-[0_0_25px_rgba(59,130,246,0.35)] ring-1 ring-blue-500/30'
                  : 'shadow-lg shadow-blue-500/20'
              }`}
            />
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Zap<span className="text-blue-500">Store</span>
          </h1>
          <p className={`text-xs sm:text-sm max-w-xs ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Acesse seu painel administrativo para gerenciar sua loja e catálogo no WhatsApp
          </p>
        </div>

        {/* Main Login Card */}
        <div className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
          isDark
            ? 'bg-[#0c101a]/95 border-slate-800/90 shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-xl'
            : 'bg-white border-slate-200/90 shadow-xl shadow-slate-200/70'
        }`}>
          {/* Card Header */}
          <div className={`p-6 sm:px-8 border-b ${
            isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-100 bg-white'
          }`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Entrar na Conta
            </h2>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Informe seu e-mail e senha de lojista ou administrador
            </p>
          </div>

          <div className="p-6 sm:px-8">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5 text-left">
                <Label htmlFor="email" className={`text-xs sm:text-sm font-semibold ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  E-mail de acesso
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu-email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-11 rounded-xl text-xs sm:text-sm transition pl-9 ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    required
                  />
                  <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={`text-xs sm:text-sm font-semibold ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Senha
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      toast.info('Recuperação de Acesso', {
                        description: 'Para redefinir sua senha, entre em contato com o suporte oficial pelo WhatsApp.',
                        action: {
                          label: 'Falar no WhatsApp',
                          onClick: () =>
                            window.open(
                              'https://wa.me/5521964639999?text=' +
                                encodeURIComponent(
                                  'Olá equipe ZapStore! Preciso de ajuda para redefinir minha senha da conta: ' +
                                    (email.trim() ? email.trim() : '')
                                ),
                              '_blank'
                            ),
                        },
                        duration: 8000,
                      });
                    }}
                    className="text-xs text-blue-500 hover:text-blue-400 transition cursor-pointer font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha secreta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-11 rounded-xl text-xs sm:text-sm pr-10 pl-9 transition ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    required
                  />
                  <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors ${
                      isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error feedback */}
              {error && (
                <div className={`p-3 rounded-xl text-xs sm:text-sm text-left font-medium flex items-start gap-2 border animate-in fade-in ${
                  isDark
                    ? 'bg-rose-950/40 border-rose-900/60 text-rose-300'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  <span className="text-rose-500 font-bold shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Pre-filled account badge */}
              {filledAccount && (
                <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between border animate-in fade-in ${
                  isDark
                    ? 'bg-blue-950/40 border-blue-900/60 text-blue-300'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Conta preenchida: <strong>{filledAccount}</strong></span>
                  </div>
                  <span className={`text-[10px] font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    Pronto para entrar
                  </span>
                </div>
              )}

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <span>Entrar no Painel</span>
                )}
              </Button>
            </form>
          </div>

          {/* Footer link to signup */}
          <div className={`py-4 px-6 sm:px-8 border-t text-center ${
            isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-100 bg-slate-50/60'
          }`}>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Ainda não tem sua loja?{' '}
              <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-bold hover:underline">
                Criar loja grátis &rarr;
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials Box */}
        <div className={`rounded-2xl border transition-all overflow-hidden ${
          isDark
            ? 'bg-[#0c101a]/90 border-slate-800/90 shadow-lg'
            : 'bg-white border-slate-200/90 shadow-md'
        }`}>
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className={`w-full flex items-center justify-between p-3.5 sm:p-4 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              isDark ? 'text-slate-200 hover:bg-slate-900/60' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-blue-500" />
              <span>Contas de Demonstração (1 Clique)</span>
            </div>
            {showDemo ? (
              <ChevronUp size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            ) : (
              <ChevronDown size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            )}
          </button>

          {showDemo && (
            <div className={`p-4 pt-1 border-t space-y-3 ${
              isDark ? 'border-slate-800/80 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'
            }`}>
              <p className={`text-[11px] text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Clique em qualquer loja demo ou no admin para preencher e testar:
              </p>

              {/* Super Admin & Modelo Terephones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Admin */}
                <button
                  type="button"
                  onClick={() => autofill('admin@cronos.com', 'admin123', 'Super Admin')}
                  className={`p-2.5 text-left rounded-xl border transition-all group cursor-pointer ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/80 hover:bg-slate-850'
                      : 'bg-white border-slate-200 hover:border-purple-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60' : 'bg-purple-100 text-purple-700'
                    }`}>
                      Super Admin
                    </span>
                    <Shield className="w-3 h-3 text-purple-500" />
                  </div>
                  <p className={`text-xs font-bold truncate group-hover:text-purple-400 transition-colors ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    admin@cronos.com
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">admin123</p>
                </button>

                {/* Terephones (Loja Modelo) */}
                <button
                  type="button"
                  onClick={() => autofill('terephones@example.com', 'tere123', 'Terephones (iPhones)')}
                  className={`p-2.5 text-left rounded-xl border transition-all group cursor-pointer ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/80 hover:bg-slate-850'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60' : 'bg-blue-100 text-blue-700'
                    }`}>
                      📱 iPhones (Modelo)
                    </span>
                    <Sparkles className="w-3 h-3 text-blue-500" />
                  </div>
                  <p className={`text-xs font-bold truncate group-hover:text-blue-400 transition-colors ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    terephones@...
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">tere123</p>
                </button>
              </div>

              {/* 5 Niche Demo Stores */}
              <div className="space-y-1.5 pt-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider block text-left ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  5 Lojas Demos de Nichos:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Prime Motors */}
                  <button
                    type="button"
                    onClick={() => autofill('motors@zapstore.com', 'motors123', 'Prime Motors (Carros)')}
                    className={`p-2.5 text-left rounded-xl border transition-all group cursor-pointer ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/80 hover:bg-slate-850'
                        : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-amber-950/50 text-amber-300 border border-amber-800/60' : 'bg-amber-50 text-amber-700'
                      }`}>
                        🏎️ Carros & Veículos
                      </span>
                    </div>
                    <p className={`text-xs font-bold truncate group-hover:text-amber-400 transition-colors ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      motors@zapstore.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">motors123</p>
                  </button>

                  {/* Nexus Digital */}
                  <button
                    type="button"
                    onClick={() => autofill('digital@zapstore.com', 'digital123', 'Nexus Digital (Cursos/IA)')}
                    className={`p-2.5 text-left rounded-xl border transition-all group cursor-pointer ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/80 hover:bg-slate-850'
                        : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-800/60' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        💻 Cursos & Infoprodutos
                      </span>
                    </div>
                    <p className={`text-xs font-bold truncate group-hover:text-indigo-400 transition-colors ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      digital@zapstore.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">digital123</p>
                  </button>

                  {/* Aura Store */}
                  <button
                    type="button"
                    onClick={() => autofill('moda@zapstore.com', 'moda123', 'Aura Store (Streetwear)')}
                    className={`p-2.5 text-left rounded-xl border transition-all group cursor-pointer ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 hover:border-pink-500/80 hover:bg-slate-850'
                        : 'bg-white border-slate-200 hover:border-pink-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-pink-950/50 text-pink-300 border border-pink-800/60' : 'bg-pink-50 text-pink-700'
                      }`}>
                        👕 Moda & Streetwear
                      </span>
                    </div>
                    <p className={`text-xs font-bold truncate group-hover:text-pink-400 transition-colors ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      moda@zapstore.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">moda123</p>
                  </button>

                  {/* Craft Burger */}
                  <button
                    type="button"
                    onClick={() => autofill('burger@zapstore.com', 'burger123', 'Craft Burger (Gastronomia)')}
                    className={`p-2.5 text-left rounded-xl border transition-all group cursor-pointer ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 hover:border-orange-500/80 hover:bg-slate-850'
                        : 'bg-white border-slate-200 hover:border-orange-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-orange-950/50 text-orange-300 border border-orange-800/60' : 'bg-orange-50 text-orange-700'
                      }`}>
                        🍔 Hamburgueria / Delivery
                      </span>
                    </div>
                    <p className={`text-xs font-bold truncate group-hover:text-orange-400 transition-colors ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      burger@zapstore.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">burger123</p>
                  </button>

                  {/* Alpha Imóveis */}
                  <button
                    type="button"
                    onClick={() => autofill('imoveis@zapstore.com', 'imoveis123', 'Alpha Imóveis (Imobiliária)')}
                    className={`p-2.5 text-left rounded-xl border transition-all group cursor-pointer sm:col-span-2 ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 hover:border-teal-500/80 hover:bg-slate-850'
                        : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-teal-950/50 text-teal-300 border border-teal-800/60' : 'bg-teal-50 text-teal-700'
                      }`}>
                        🏡 Imobiliária
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold truncate group-hover:text-teal-400 transition-colors ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        imoveis@zapstore.com
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">imoveis123</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
