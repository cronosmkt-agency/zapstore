import { useState, useEffect } from "react";
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Download,
  AlertCircle,
  HelpCircle,
  Trash2,
} from "lucide-react";
import {
  fetchGoogleSheetInventory,
  normalizeGoogleSheetUrl,
  STORAGE_SHEET_URL_KEY,
} from "@/services/googleSheets";
import type { ProductItem } from "./ProductDetailModal";
import { toast } from "sonner";

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess: (products: ProductItem[], url: string) => void;
  onResetDefault: () => void;
  currentUrl?: string;
  isCustomActive: boolean;
}

export function GoogleSheetSyncModal({
  isOpen,
  onClose,
  onSyncSuccess,
  onResetDefault,
  currentUrl = "",
  isCustomActive,
}: GoogleSheetSyncModalProps) {
  const [url, setUrl] = useState(currentUrl);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ count: number; items: string[] } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setUrl(currentUrl);
    setTestResult(null);
    setErrorMsg(null);
  }, [currentUrl, isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!url.trim()) {
      setErrorMsg("Por favor, cole a URL da sua planilha do Google.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setTestResult(null);

    try {
      const items = await fetchGoogleSheetInventory(url);
      setTestResult({
        count: items.length,
        items: items.slice(0, 3).map(i => `${i.name} (${i.badge}) - R$ ${i.price}`),
      });

      localStorage.setItem(STORAGE_SHEET_URL_KEY, url.trim());
      onSyncSuccess(items, url.trim());
      toast.success(`Estoque sincronizado! ${items.length} iPhones carregados da sua planilha.`);
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          "Não foi possível conectar à planilha. Verifique se ela foi publicada na web como CSV."
      );
      toast.error("Erro na sincronização da planilha.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_SHEET_URL_KEY);
    setUrl("");
    setTestResult(null);
    setErrorMsg(null);
    onResetDefault();
    toast.info("Catálogo restaurado para o estoque padrão Terephones.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass w-full max-w-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-5 sm:p-7 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Sincronizar com Planilha Google
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atualize preços e estoque do site pelo Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status atual */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isCustomActive ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
              }`}
            />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isCustomActive
                ? "Conectado à Planilha do Google Drive"
                : "Catálogo Padrão Terephones (15 iPhones em estoque)"}
            </span>
          </div>

          {isCustomActive && (
            <button
              onClick={handleReset}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Desconectar</span>
            </button>
          )}
        </div>

        {/* Passo a Passo */}
        <div className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
          <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            Como conectar sua planilha em 4 passos:
          </p>

          <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
            <li>
              Crie ou abra sua planilha de estoque no <strong>Google Drive</strong>.
            </li>
            <li>
              No menu superior, clique em{" "}
              <strong className="text-slate-900 dark:text-white">
                Arquivo &gt; Compartilhar &gt; Publicar na Web
              </strong>
              .
            </li>
            <li>
              Troque a opção de <em>&quot;Página da Web&quot;</em> para{" "}
              <strong className="text-blue-500 dark:text-sky-400">
                &quot;Valores separados por vírgula (.csv)&quot;
              </strong>{" "}
              e clique no botão verde <strong>Publicar</strong>.
            </li>
            <li>
              Copie o link gerado pelo Google, cole no campo abaixo e clique em <strong>Sincronizar</strong>.
            </li>
          </ol>
        </div>

        {/* Modelo CSV para Download */}
        <div className="mt-4 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-900 dark:text-blue-200">
              Planilha Modelo Terephones
            </div>
            <div className="text-[11px] text-blue-700 dark:text-blue-300">
              Já com as colunas corretas (MODELO, BATERIA, PREÇO, etc.)
            </div>
          </div>
          <a
            href="/estoque-terephones.csv"
            download="estoque-terephones.csv"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar CSV</span>
          </a>
        </div>

        {/* Campo de URL */}
        <div className="mt-5 space-y-2">
          <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
            Link da Planilha Publicada (CSV ou Google Sheets):
          </label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
            className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Erro */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sucesso / Teste */}
        {testResult && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Sincronizado com sucesso! {testResult.count} modelos encontrados:
            </div>
            <ul className="mt-1.5 space-y-0.5 pl-5 list-disc text-[11px]">
              {testResult.items.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
              {testResult.count > 3 && <li>...e mais {testResult.count - 3} iPhones</li>}
            </ul>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fechar
          </button>
          <button
            onClick={handleTestAndSave}
            disabled={loading}
            className="w-full sm:w-auto btn-primary-glow px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Carregando Planilha...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Salvar &amp; Sincronizar Estoque</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
