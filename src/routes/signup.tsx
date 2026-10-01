import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { signup, checkSlugAvailability } from '@/lib/auth'
import { isValidSlug, sanitizeSlug, slugErrorMessage } from '@/lib/slugUtils'
import { db } from '@/lib/mockDb'
import { PlanSlug } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, Check, X, Store, CreditCard, User, AlertCircle, CheckCircle2, ArrowLeft, Sun, Moon, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const { session, refreshSession } = useAuth()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [storeName, setStoreName] = useState('')
  const [slug, setSlug] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [niche, setNiche] = useState('celulares')
  
  const [selectedPlan, setSelectedPlan] = useState<PlanSlug>('free')
  const plans = db.plans.getAll()

  // Theme support
  const [theme, setTheme] = useState<'white' | 'black-piano'>('white')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('zapstore_auth_theme')
      if (t === 'black-piano' || document.documentElement.classList.contains('theme-black-piano') || document.documentElement.classList.contains('dark')) {
        setTheme('black-piano')
      }
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'black-piano' ? 'white' : 'black-piano'
    setTheme(next)
    localStorage.setItem('zapstore_auth_theme', next)
    const root = document.documentElement
    root.classList.remove('theme-white', 'theme-black-piano', 'dark')
    if (next === 'black-piano') {
      root.classList.add('theme-black-piano', 'dark')
    } else {
      root.classList.add('theme-white')
    }
  }

  // Slug validation states
  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate({ to: session.is_admin ? '/admin' : '/dashboard' })
    }
  }, [session, navigate])

  // Auto-generate slug from store name
  useEffect(() => {
    if (storeName && !slug) {
      setSlug(sanitizeSlug(storeName))
    }
  }, [storeName, slug])

  // Debounced slug check
  useEffect(() => {
    const checkTimer = setTimeout(async () => {
      if (!slug) {
        setSlugAvailable(null)
        return
      }
      if (!isValidSlug(slug)) {
        setSlugAvailable(false)
        return
      }
      
      setSlugChecking(true)
      const available = await checkSlugAvailability(slug)
      setSlugAvailable(available)
      setSlugChecking(false)
    }, 500)

    return () => clearTimeout(checkTimer)
  }, [slug])

  const handleNextStep1 = () => {
    setError(null)
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios')
      return
    }
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    setStep(2)
  }

  const handleNextStep2 = () => {
    setError(null)
    if (!storeName || !slug) {
      setError('Preencha o nome e o link da loja')
      return
    }
    if (!isValidSlug(slug)) {
      setError(slugErrorMessage(slug) || 'Link inválido')
      return
    }
    if (slugAvailable === false) {
      setError('Este link já está em uso, escolha outro')
      return
    }
    setStep(3)
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    try {
      const result = await signup({
        email,
        password,
        full_name: fullName,
        store_name: storeName,
        slug,
        whatsapp,
        plan: selectedPlan,
        niche,
      })

      if (result.ok) {
        await refreshSession()
        navigate({ to: '/dashboard' })
      } else {
        setError(result.error || 'Erro ao criar conta')
      }
    } catch (err) {
      setError('Erro inesperado ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center transition-colors duration-300 selection:bg-blue-600 selection:text-white ${
        theme === 'black-piano'
          ? 'bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#050505] text-white'
          : 'bg-gradient-to-b from-slate-50 via-slate-100/80 to-slate-200/50 text-slate-900'
      }`}
    >
      {/* Top back link & theme toggle */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition ${
            theme === 'black-piano' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-blue-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Início</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition cursor-pointer ${
            theme === 'black-piano'
              ? 'bg-slate-900/80 text-amber-300 border-slate-700/80 hover:bg-slate-800'
              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          }`}
          title={theme === 'black-piano' ? 'Mudar para Modo Claro' : 'Mudar para Black Piano'}
        >
          {theme === 'black-piano' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{theme === 'black-piano' ? 'Black Piano' : 'Modo Claro'}</span>
        </button>
      </div>

      <div className="w-full max-w-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <img
            src="/zapstore-logo.png"
            alt="ZapStore"
            className="w-13 h-13 rounded-2xl shadow-lg shadow-blue-500/20 object-cover mb-0.5"
          />
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme === 'black-piano' ? 'text-white' : 'text-slate-900'}`}>
            ZapStore
          </h1>
          <p className={`text-xs sm:text-sm max-w-sm ${theme === 'black-piano' ? 'text-slate-400' : 'text-slate-500'}`}>
            Crie sua loja digital em minutos e receba pedidos organizados no WhatsApp
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 relative px-4">
          <div className={`absolute left-8 right-8 top-5 -translate-y-1/2 h-1 -z-10 rounded-full overflow-hidden ${
            theme === 'black-piano' ? 'bg-slate-800' : 'bg-slate-200'
          }`}>
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
          
          {[
            { id: 1, label: 'Conta', icon: User },
            { id: 2, label: 'Loja & Nicho', icon: Store },
            { id: 3, label: 'Plano', icon: CreditCard }
          ].map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= s.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30' 
                  : theme === 'black-piano' ? 'bg-[#181818] border-slate-700 text-slate-500' : 'bg-white border-slate-300 text-slate-400'
              }`}>
                <s.icon size={18} />
              </div>
              <span className={`text-xs font-bold ${
                step >= s.id ? (theme === 'black-piano' ? 'text-blue-400' : 'text-blue-600') : (theme === 'black-piano' ? 'text-slate-500' : 'text-slate-400')
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <Card className={`border shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 ${
          theme === 'black-piano'
            ? 'bg-[#121212]/95 border-slate-800/80 text-white shadow-black/80'
            : 'bg-white border-slate-200/90 text-slate-900 shadow-slate-200/70'
        }`}>
          <CardHeader className={`space-y-1 pb-4 pt-6 px-4 sm:px-8 border-b ${
            theme === 'black-piano' ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <CardTitle className={`text-lg sm:text-xl font-bold ${theme === 'black-piano' ? 'text-white' : 'text-slate-900'}`}>
              {step === 1 && 'Crie sua conta de lojista'}
              {step === 2 && 'Configure os dados da sua loja'}
              {step === 3 && 'Escolha seu plano para começar'}
            </CardTitle>
            <CardDescription className={`text-xs sm:text-sm ${theme === 'black-piano' ? 'text-slate-400' : 'text-slate-500'}`}>
              {step === 1 && 'Preencha seus dados cadastrais para acessar a plataforma'}
              {step === 2 && 'Defina o nome fantasia, nicho e link exclusivo da sua loja'}
              {step === 3 && 'Selecione o plano ideal. Você pode mudar a qualquer momento.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 sm:pt-6 px-4 sm:px-8">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className={`text-xs sm:text-sm font-semibold ${theme === 'black-piano' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Nome Completo *
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`h-11 rounded-xl transition ${
                      theme === 'black-piano'
                        ? 'bg-[#1a1a1a] border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#202020]'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600'
                    }`}
                    placeholder="João Silva"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className={`text-xs sm:text-sm font-semibold ${theme === 'black-piano' ? 'text-slate-300' : 'text-slate-700'}`}>
                    E-mail profissional *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-11 rounded-xl transition ${
                      theme === 'black-piano'
                        ? 'bg-[#1a1a1a] border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#202020]'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600'
                    }`}
                    placeholder="seuemail@exemplo.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 relative">
                    <Label htmlFor="password" className={`text-xs sm:text-sm font-semibold ${theme === 'black-piano' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Senha *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`h-11 pr-10 rounded-xl transition ${
                          theme === 'black-piano'
                            ? 'bg-[#1a1a1a] border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#202020]'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600'
                        }`}
                        placeholder="Mín. 8 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className={`text-xs sm:text-sm font-semibold ${theme === 'black-piano' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Confirmar Senha *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-11 rounded-xl transition ${
                        theme === 'black-piano'
                          ? 'bg-[#1a1a1a] border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#202020]'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600'
                      }`}
                      placeholder="Repita sua senha"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <Label htmlFor="storeName" className={`text-xs sm:text-sm font-semibold ${theme === 'black-piano' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Nome da Loja *
                  </Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className={`h-11 rounded-xl transition ${
                      theme === 'black-piano'
                        ? 'bg-[#1a1a1a] border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600'
                    }`}
                    placeholder="Ex: Prime Imports, Streetwear House..."
                  />
                </div>

                {/* Niche Selector */}
                <div className="space-y-1.5">
                  <Label className={`text-xs sm:text-sm font-semibold ${theme === 'black-piano' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Nicho Principal da Loja *
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'celulares', label: '📱 Celulares & Apple', desc: 'iPhones, Acessórios' },
                      { id: 'moda', label: '👗 Moda & Roupas', desc: 'Streetwear, Calçados' },
                      { id: 'gastronomia', label: '🍔 Gastronomia', desc: 'Burgers, Delivery' },
                      { id: 'veiculos', label: '🚗 Veículos & Carros', desc: 'Concessionária, Seminovos' },
                      { id: 'imoveis', label: '🏠 Imóveis & Imobiliária', desc: 'Casas, Apartamentos' },
                      { id: 'infoprodutos', label: '💻 Cursos & Digital', desc: 'Infoprodutos, Mentorias' },
                      { id: 'geral', label: '📦 Catálogo Geral', desc: 'Produtos Variados' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setNiche(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          niche === item.id
                            ? 'border-blue-600 bg-blue-500/15 text-blue-600 dark:text-sky-400 font-bold ring-2 ring-blue-500/30'
                            : theme === 'black-piano'
                            ? 'border-slate-800 bg-[#161616] text-slate-300 hover:border-slate-700 hover:bg-[#1a1a1a]'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">Ajusta automaticamente categorias e recursos recomendados para seu negócio.</p>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="slug" className={`text-xs sm:text-sm font-semibold ${theme === 'black-piano' ? 'text-slate-300' : 'text-slate-700'}`}>
                    Link Exclusivo da Loja (Slug) *
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className={`h-11 pr-10 rounded-xl transition ${
                          slugAvailable === true ? 'border-emerald-500 focus-visible:ring-emerald-500' :
                          slugAvailable === false ? 'border-red-500 focus-visible:ring-red-500' :
                          theme === 'black-piano' ? 'bg-[#1a1a1a] border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                        }`}
                        placeholder="sualoja"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {slugChecking ? (
                          <Loader2 size={16} className="text-slate-400 animate-spin" />
                        ) : slugAvailable === true ? (
                          <Check size={16} className="text-emerald-500" />
                        ) : slugAvailable === false ? (
                          <X size={16} className="text-red-500" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-xl flex items-center justify-between border ${
                    theme === 'black-piano' ? 'bg-[#181818] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-xs text-slate-500 font-medium">Link do seu catálogo:</span>
                    <span className="text-xs text-blue-500 dark:text-sky-400 font-mono font-bold break-all text-right">
                      zapstore.com/<span className={theme === 'black-piano' ? 'text-white' : 'text-slate-900'}>{slug || 'sualoja'}</span>
                    </span>
                  </div>

                  {slugAvailable === false && slug && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle size={14} />
                      {slugErrorMessage(slug) || 'Este link já está em uso.'}
                    </p>
                  )}
                  {slugAvailable === true && slug && (
                    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
                      <CheckCircle2 size={14} /> Link disponível!
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp" className={`text-xs sm:text-sm font-semibold ${theme === 'black-piano' ? 'text-slate-300' : 'text-slate-700'}`}>
                    WhatsApp de Atendimento (Opcional)
                  </Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={`h-11 rounded-xl transition ${
                      theme === 'black-piano'
                        ? 'bg-[#1a1a1a] border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600'
                    }`}
                    placeholder="(21) 99999-9999"
                  />
                  <p className="text-[11px] text-slate-400">É o número onde os clientes enviarão os pedidos fechados.</p>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {plans.map((plan) => (
                  <div 
                    key={plan.slug}
                    onClick={() => setSelectedPlan(plan.slug)}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPlan === plan.slug 
                        ? 'border-blue-600 bg-blue-500/10 shadow-md shadow-blue-500/10' 
                        : theme === 'black-piano'
                        ? 'border-slate-800 bg-[#161616] hover:border-slate-700'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {selectedPlan === plan.slug && (
                      <div className="absolute top-3 right-3">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      </div>
                    )}
                    
                    <h3 className={`font-bold text-base ${theme === 'black-piano' ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                    <div className="mt-1 mb-3">
                      <span className={`text-2xl font-black ${theme === 'black-piano' ? 'text-white' : 'text-slate-900'}`}>
                        {fmt(plan.price_monthly ?? plan.price ?? 0)}
                      </span>
                      <span className="text-slate-500 text-xs">/mês</span>
                    </div>
                    
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <Check size={14} className="text-blue-500 shrink-0" />
                        <span className={theme === 'black-piano' ? 'text-slate-300' : 'text-slate-600'}>
                          Até {plan.limits?.products === -1 || plan.max_products === undefined ? 'Ilimitados' : (plan.limits?.products ?? plan.max_products)} produtos
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check size={14} className="text-blue-500 shrink-0" />
                        <span className={theme === 'black-piano' ? 'text-slate-300' : 'text-slate-600'}>
                          Link exclusivo da loja
                        </span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs sm:text-sm text-red-500 font-medium text-center">
                {error}
              </div>
            )}

          </CardContent>
          <CardFooter className={`flex flex-col-reverse sm:flex-row justify-between gap-2.5 border-t py-4 px-4 sm:px-8 ${
            theme === 'black-piano' ? 'border-slate-800/80 bg-[#0d0d0d]/80' : 'border-slate-100 bg-slate-50/60'
          }`}>
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className={`w-full sm:w-auto rounded-xl ${
                  theme === 'black-piano' ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Voltar
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                asChild
                className={`w-full sm:w-auto ${theme === 'black-piano' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Link to="/login">Já tenho conta</Link>
              </Button>
            )}

            {step === 1 && (
              <Button onClick={handleNextStep1} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6">
                Próximo: Loja &rarr;
              </Button>
            )}
            
            {step === 2 && (
              <Button 
                onClick={handleNextStep2} 
                disabled={slugChecking || slugAvailable === false}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6"
              >
                Próximo: Plano &rarr;
              </Button>
            )}

            {step === 3 && (
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 shadow-lg shadow-blue-600/25"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? 'Criando Loja...' : 'Criar Minha Loja'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
