import { Compass } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-parchment text-ink flex flex-col">
      <header className="border-b border-parchment-border bg-parchment-surface/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-terracotta" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Cartografia Histórica &amp; Interpretação do Brasil
            </span>
          </div>
          <span className="text-xs font-medium text-forest bg-forest/10 border border-forest/20 px-2.5 py-1 rounded-full">
            Etapa 1 · Setup Ativo
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <section className="max-w-2xl w-full bg-parchment-surface border border-parchment-border rounded-lg p-10 shadow-sm text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta mb-4">
            Edição Interativa
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-ink mb-5">
            Atlas da Formação do Brasil
          </h1>
          <p className="text-base sm:text-lg text-ink-muted leading-relaxed mb-8">
            Ambiente base em Vite, React, TypeScript e Tailwind CSS configurado com o sistema visual{' '}
            <span className="text-ink font-medium">Editorial Cartográfico Contemporâneo</span> — pronto para receber as camadas geográficas e os marcos históricos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-parchment-border">
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded bg-parchment border border-parchment-border text-ink">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta" aria-hidden="true" />
              Colônia · Terracota
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded bg-parchment border border-parchment-border text-ink">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-atlas" aria-hidden="true" />
              Império · Azul-Índigo
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded bg-parchment border border-parchment-border text-ink">
              <span className="w-2.5 h-2.5 rounded-full bg-forest" aria-hidden="true" />
              República · Verde-Mata
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded bg-parchment border border-parchment-border text-ink">
              <span className="w-2.5 h-2.5 rounded-full bg-ochre" aria-hidden="true" />
              Continuidades · Ocre
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
