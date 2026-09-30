import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { login } from '@/lib/auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
} from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { session, refreshSession } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDemo, setShowDemo] = useState(true)
  const [filledAccount, setFilledAccount] = useState<string | null>(null)
  const [theme, setTheme] = useState<'white' | 'black-piano'>('white')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('terephones_theme')
      if (t === 'black-piano' || document.documentElement.classList.contains('theme-black-piano')) {
        setTheme('black-piano')
      }
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'black-piano' ? 'white' : 'black-piano'
    setTheme(next)
    localStorage.setItem('terephones_theme', next)
    const root = document.documentElement
    root.classList.remove('theme-white', 'theme-black-piano', 'dark')
    if (next === 'black-piano') {
      root.classList.add('theme-black-piano', 'dark')
    } else {
      root.classList.add('theme-white')
    }
  }

  // Redirect if already logged in
  if (session) {
    navigate({ to: session.is_admin ? '/admin' : '/dashboard' })
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await login(email, password)
      if (result.ok) {
        await refreshSession()
        navigate({ to: result.session?.is_admin ? '/admin' : '/dashboard' })
      } else {
        setError(result.error || 'Credenciais inválidas. Verifique seu e-mail e senha.')
      }
    } catch (err) {
      setError('Erro inesperado ao conectar ao servidor local.')
    } finally {
      setLoading(false)
    }
  }

  const autofill = (em: string, pass: string, name: string) => {
    setEmail(em)
    setPassword(pass)
    setFilledAccount(name)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100/80 to-slate-200/50 dark:from-[#05070c] dark:via-[#090c14] dark:to-[#05070c] p-4 sm:p-6 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Top back link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Início</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-[#121726] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 shadow-xs transition cursor-pointer"
          title="Alternar entre Modo White e Black Piano"
        >
          {theme === 'black-piano' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Black Piano</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-500" />
              <span>Modo White</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <img
            src="/zapstore-logo.png"
            alt="ZapStore"
            className="w-14 h-14 rounded-2xl shadow-lg shadow-blue-500/20 object-cover mb-1"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ZapStore
          </h1>
          <p className="text-sm text-slate-500 max-w-xs">
            Acesse seu painel administrativo para gerenciar sua loja e produtos
          </p>
        </div>

        {/* Main Login Card - Clean Solid White */}
        <Card className="bg-white border border-slate-200/90 shadow-xl shadow-slate-200/70 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4 pt-6 px-6 sm:px-8 border-b border-slate-100">
            <CardTitle className="text-xl font-bold text-slate-900">Entrar na Conta</CardTitle>
            <CardDescription className="text-slate-500 text-xs sm:text-sm">
              Informe seu e-mail e senha de lojista ou administrador
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 px-6 sm:px-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-700">
                  E-mail de acesso
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@sualoja.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-slate-700">
                    Senha
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      toast.info("Recuperação de Acesso", {
                        description: "Para redefinir sua senha com segurança, fale com nosso suporte no WhatsApp.",
                        action: {
                          label: "Falar no WhatsApp",
                          onClick: () =>
                            window.open(
                              "https://wa.me/5521964639999?text=" +
                                encodeURIComponent(
                                  "Olá equipe ZapStore! Preciso de ajuda para redefinir minha senha da conta: " +
                                    (email.trim() ? email.trim() : "")
                                ),
                              "_blank"
                            ),
                        },
                        duration: 8000,
                      });
                    }}
                    className="text-xs text-slate-400 hover:text-blue-600 transition cursor-pointer font-medium"
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
                    className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl pr-10 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl text-xs sm:text-sm text-red-600 text-left font-medium flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {filledAccount && (
                <div className="p-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-700 font-medium flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Conta preenchida: <strong>{filledAccount}</strong></span>
                  </div>
                  <span className="text-[10px] text-blue-500">Pronto para entrar</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  'Entrar no Painel'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 py-4 px-6 sm:px-8 bg-slate-50/60">
            <p className="text-xs sm:text-sm text-slate-500">
              Ainda não tem sua loja?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                Criar loja grátis &rarr;
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo Credentials Box */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-md">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between p-4 text-xs sm:text-sm text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-blue-600" />
              <span>Contas de Demonstração (1 Clique)</span>
            </div>
            {showDemo ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {showDemo && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-3 mt-2 bg-slate-50/40">
              <p className="text-[11px] text-slate-500 text-left">
                Clique em qualquer loja demo ou no admin para preencher e testar:
              </p>

              {/* Admin & Modelo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Admin */}
                <button
                  type="button"
                  onClick={() => autofill('admin@zapstore.com', 'admin123', 'Super Admin')}
                  className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-sm transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                      Super Admin
                    </span>
                    <Shield className="w-3 h-3 text-purple-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-purple-600">
                    admin@zapstore.com
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">admin123</p>
                </button>

                {/* Terephones (Loja Modelo Celulares) */}
                <button
                  type="button"
                  onClick={() => autofill('terephones@example.com', 'tere123', 'Terephones (iPhones)')}
                  className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                      📱 iPhones (Modelo)
                    </span>
                    <Sparkles className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600">
                    terephones@...
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">tere123</p>
                </button>
              </div>

              {/* 5 Niche Demo Stores */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                  5 Lojas Demos de Nichos:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Prime Motors */}
                  <button
                    type="button"
                    onClick={() => autofill('motors@zapstore.com', 'motor123', 'Prime Motors (Carros)')}
                    className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        🏎️ Carros & Veículos
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-600">
                      motors@zapstore.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">motor123</p>
                  </button>

                  {/* Nexus Digital */}
                  <button
                    type="button"
                    onClick={() => autofill('digital@zapstore.com', 'digital123', 'Nexus Digital (Cursos/IA)')}
                    className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        💻 Cursos & Infoprodutos
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">
                      digital@zapstore.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">digital123</p>
                  </button>

                  {/* Aura Store */}
                  <button
                    type="button"
                    onClick={() => autofill('moda@zapstore.com', 'moda123', 'Aura Store (Streetwear)')}
                    className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-pink-400 hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded">
                        👕 Moda & Streetwear
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-pink-600">
                      moda@zapstore.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">moda123</p>
                  </button>

                  {/* Craft Burger */}
                  <button
                    type="button"
                    onClick={() => autofill('burger@zapstore.com', 'burger123', 'Craft Burger (Gastronomia)')}
                    className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">
                        🍔 Hamburgueria / Delivery
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600">
                      burger@zapstore.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">burger123</p>
                  </button>

                  {/* Alpha Imóveis */}
                  <button
                    type="button"
                    onClick={() => autofill('imoveis@zapstore.com', 'imovel123', 'Alpha Imóveis (Alto Padrão)')}
                    className="p-2.5 text-left rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-sm transition-all group cursor-pointer sm:col-span-2"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        🏡 Imobiliária & Alto Padrão
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-teal-600">
                        imoveis@zapstore.com
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">imovel123</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
