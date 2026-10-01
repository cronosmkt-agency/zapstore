import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CursorEffects } from "../components/CursorEffects";
import { Toaster } from "@/components/ui/sonner";
import { TawkFloatingWidget } from "@/components/TawkFloatingWidget";
import { AuthProvider } from "@/context/AuthContext";
import { initDb } from "@/lib/mockDb";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você está procurando não existe, foi alterada ou está temporariamente indisponível.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: any; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Ops! Ocorreu um erro inesperado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Não conseguimos carregar os dados desta página. Tente recarregar ou retornar para a página inicial.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm cursor-pointer"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            Ir para o Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ZapStore — Crie sua Loja Online e Venda pelo WhatsApp em Minutos" },
      { name: "description", content: "ZapStore: Plataforma SaaS multi-lojas para criar seu catálogo digital, receber pedidos organizados direto no WhatsApp e gerenciar produtos, clientes e vendas com facilidade." },
      { name: "author", content: "ZapStore" },
      { property: "og:title", content: "ZapStore — Crie sua Loja Online e Venda pelo WhatsApp em Minutos" },
      { property: "og:description", content: "Crie sua loja online personalizada em minutos para qualquer nicho e receba pedidos organizados diretamente no seu WhatsApp." },
      { property: "og:image", content: "/zapstore-logo.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/zapstore-logo.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/zapstore-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "ZapStore",
              alternateName: "ZapStore SaaS Multi-Lojas",
              url: "https://zapstore-mu.vercel.app",
              logo: "https://zapstore-mu.vercel.app/zapstore-logo.png",
              sameAs: [
                "https://github.com/cronosmkt-agency/zapstore"
              ],
            },
            {
              "@type": "WebSite",
              name: "ZapStore",
              url: "https://zapstore-mu.vercel.app",
              inLanguage: "pt-BR",
            },
          ],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var p = window.location.pathname;
                var reserved = ['dashboard', 'admin', 'login', 'signup', 'termos-de-uso', 'politica-de-privacidade'];
                var seg = p.split('/').filter(Boolean)[0] || '';
                // Store routes
                if (seg && reserved.indexOf(seg) === -1) {
                  var t = localStorage.getItem('zapstore_theme_' + seg) || (seg === 'terephones' ? localStorage.getItem('terephones_theme') : null);
                  if (t === 'black-piano') {
                    document.documentElement.classList.add('theme-black-piano', 'dark');
                  } else if (t === 'white') {
                    document.documentElement.classList.add('theme-white');
                    document.documentElement.classList.remove('dark');
                  }
                } else if (!seg) {
                  // Landing page
                  var lt = localStorage.getItem('zapstore_landing_theme');
                  if (lt === 'black-piano') {
                    document.documentElement.classList.add('theme-black-piano', 'dark');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Inicializar banco de dados mock na primeira execução
    if (typeof window !== "undefined") {
      initDb();
    }
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CursorEffects />
        <Toaster position="top-center" offset="84px" duration={1400} richColors />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </QueryClientProvider>
    </AuthProvider>
  );
}
