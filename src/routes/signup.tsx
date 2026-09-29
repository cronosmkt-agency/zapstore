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
import { Eye, EyeOff, Loader2, Check, X, Store, CreditCard, User, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'

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
  
  const [selectedPlan, setSelectedPlan] = useState<PlanSlug>('free')
  const plans = db.plans.getAll()

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
        plan: selectedPlan
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/80 to-slate-200/50 p-4 sm:p-6 flex flex-col items-center justify-center text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top back link */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Início</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Modo White
        </span>
      </div>

      <div className="w-full max-w-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <img
            src="/zapstore-logo.png"
            alt="ZapStore"
            className="w-13 h-13 rounded-2xl shadow-lg shadow-blue-500/20 object-cover mb-0.5"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ZapStore
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Crie sua loja digital em minutos e receba pedidos organizados no WhatsApp
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 relative px-4">
          <div className="absolute left-8 right-8 top-5 -translate-y-1/2 h-1 bg-slate-200 -z-10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
          
          {[
            { id: 1, label: 'Conta', icon: User },
            { id: 2, label: 'Loja', icon: Store },
            { id: 3, label: 'Plano', icon: CreditCard }
          ].map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= s.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30' 
                  : 'bg-white border-slate-300 text-slate-400'
              }`}>
                <s.icon size={18} />
              </div>
              <span className={`text-xs font-bold ${step >= s.id ? 'text-blue-600' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <Card className="bg-white border border-slate-200/90 shadow-xl shadow-slate-200/70 rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4 pt-6 px-4 sm:px-8 border-b border-slate-100">
            <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">
              {step === 1 && 'Crie sua conta de lojista'}
              {step === 2 && 'Configure os dados da sua loja'}
              {step === 3 && 'Escolha seu plano para começar'}
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs sm:text-sm">
              {step === 1 && 'Preencha seus dados cadastrais para acessar a plataforma'}
              {step === 2 && 'Defina o nome fantasia e o link exclusivo que seus clientes acessarão'}
              {step === 3 && 'Selecione o plano ideal. Você pode mudar a qualquer momento.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 sm:pt-6 px-4 sm:px-8">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-slate-700">
                    Nome Completo *
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 rounded-xl"
                    placeholder="João Silva"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-700">
                    E-mail profissional *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 rounded-xl"
                    placeholder="seuemail@exemplo.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 relative">
                    <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-slate-700">
                      Senha *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-slate-50 border-slate-200 text-slate-900 pr-10 focus:bg-white focus:border-blue-600 rounded-xl"
                        placeholder="Mín. 8 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-semibold text-slate-700">
                      Confirmar Senha *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 rounded-xl"
                      placeholder="Repita sua senha"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-5 text-left">
                <div className="space-y-1.5">
                  <Label htmlFor="storeName" className="text-xs sm:text-sm font-semibold text-slate-700">
                    Nome da Loja *
                  </Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 rounded-xl"
                    placeholder="Ex: Alfa Imports, Terephones..."
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="slug" className="text-xs sm:text-sm font-semibold text-slate-700">
                    Link Exclusivo da Loja (Slug) *
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className={`h-11 bg-slate-50 text-slate-900 pr-10 rounded-xl ${
                          slugAvailable === true ? 'border-emerald-500 focus-visible:ring-emerald-500' :
                          slugAvailable === false ? 'border-red-500 focus-visible:ring-red-500' :
                          'border-slate-200 focus:border-blue-600'
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
                  
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Link do seu catálogo:</span>
                    <span className="text-xs text-blue-600 font-mono font-bold break-all text-right">
                      zapstore.com/<span className="text-slate-900">{slug || 'sualoja'}</span>
                    </span>
                  </div>

                  {slugAvailable === false && slug && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle size={14} />
                      {slugErrorMessage(slug) || 'Este link já está em uso.'}
                    </p>
                  )}
                  {slugAvailable === true && slug && (
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                      <CheckCircle2 size={14} /> Link disponível!
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp" className="text-xs sm:text-sm font-semibold text-slate-700">
                    WhatsApp de Atendimento (Opcional)
                  </Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600 rounded-xl"
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
                        ? 'border-blue-600 bg-blue-50/60 shadow-md shadow-blue-500/10' 
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
                    
                    <h3 className="font-bold text-slate-900 text-base">{plan.name}</h3>
                    <div className="mt-1 mb-3">
                      <span className="text-2xl font-black text-slate-900">
                        {fmt(plan.price_monthly ?? plan.price ?? 0)}
                      </span>
                      <span className="text-slate-500 text-xs">/mês</span>
                    </div>
                    
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <Check size={14} className="text-blue-600 shrink-0" />
                        Até {plan.limits?.products === -1 || plan.max_products === undefined ? 'Ilimitados' : (plan.limits?.products ?? plan.max_products)} produtos
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check size={14} className="text-blue-600 shrink-0" />
                        Link exclusivo da loja
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-600 font-medium text-center">
                {error}
              </div>
            )}

          </CardContent>
          <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-2.5 border-t border-slate-100 py-4 px-4 sm:px-8 bg-slate-50/60">
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Voltar
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                asChild
                className="w-full sm:w-auto text-slate-500 hover:text-slate-900"
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
                {loading ? 'Criando Loja...' : 'Criar Minha Loja Grátis'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
