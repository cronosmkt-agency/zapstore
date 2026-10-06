import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Trash2, RefreshCw, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  maxDimension?: number;
  required?: boolean;
  helperText?: string;
}

/**
 * Redimensiona e comprime uma imagem localmente no navegador via Canvas.
 * Garante performance extrema e previne estouro do localStorage.
 */
export async function optimizeImageFile(file: File, maxDim = 1200): Promise<string> {
  // Se for SVG, manter como DataURL direto sem conversão canvas
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Tenta exportar para webp, se falhar exporta jpeg
        try {
          const webpData = canvas.toDataURL('image/webp', 0.85);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {}

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Erro ao ler a imagem.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUploadField({
  label,
  value,
  onChange,
  description,
  placeholder = 'https://...',
  aspectRatio = 'auto',
  maxDimension = 1200,
  required = false,
  helperText,
}: ImageUploadFieldProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP, SVG).');
      return;
    }

    try {
      setIsProcessing(true);
      const optimizedDataUrl = await optimizeImageFile(file, maxDimension);
      onChange(optimizedDataUrl);
      toast.success('Imagem carregada com sucesso!');
    } catch (err) {
      toast.error('Não foi possível processar a imagem selecionada.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      onChange('');
      return;
    }
    onChange(urlInput.trim());
    toast.success('Link da imagem aplicado!');
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    toast.info('Imagem removida.');
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-h-48'
      : aspectRatio === 'video'
      ? 'aspect-video max-h-56'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9] max-h-56'
      : 'max-h-60';

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Toggle Mode: Upload vs Link */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UploadCloud size={13} />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'url'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LinkIcon size={13} />
            <span>Link URL</span>
          </button>
        </div>
      </div>

      {description && <p className="text-xs text-slate-500">{description}</p>}

      {/* Se já existe uma imagem selecionada */}
      {value ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div
            className={`relative rounded-xl overflow-hidden bg-white border border-slate-200/90 flex items-center justify-center shrink-0 shadow-xs ${
              aspectRatio === 'banner'
                ? 'w-24 h-14 sm:w-28 sm:h-16'
                : 'w-16 h-16 sm:w-20 sm:h-20'
            }`}
          >
            <img
              src={value}
              alt={label}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold truncate">
              <Check size={14} className="shrink-0" />
              <span>Imagem configurada</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {value.startsWith('data:') ? 'Arquivo otimizado' : value}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Trocar</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Remover</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Se NÃO tem imagem selecionada */
        <div>
          {mode === 'upload' ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all overflow-hidden ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20'
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 shadow-xs">
                {isProcessing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {isProcessing
                  ? 'Otimizando imagem...'
                  : 'Clique para enviar ou arraste aqui'}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                PNG, JPG, WebP ou SVG (otimização automática)
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none shadow-xs min-w-0"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
              >
                Aplicar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
        className="hidden"
      />

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
}
