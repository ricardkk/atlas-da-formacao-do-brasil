import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Compass,
  GitBranch,
  MapPin,
  Sparkles,
  Trees,
  X,
} from 'lucide-react';
import {
  CONTINUITY_THREADS,
  DARCY_BRASIS,
  DARCY_BRASIS_TRANSITION_STATES,
  DIMENSIONS,
  ERAS,
  INDIGENOUS_MATRICES,
  MAP_SYMBOLS,
  THEORETICAL_LENSES,
} from '../data';
import type {
  AtlasSelection,
  DarcyBrasilId,
  IndigenousTrunkId,
  TheoreticalLensId,
} from '../types';
import {
  getDarcyBrasilById,
  getEventById,
  getEventsForLens,
  getIndigenousMatrixById,
  getLensById,
  getThreadById,
  getThreadsForEvent,
} from '../utils/filters';
import { MapSymbol } from './MapSymbols';

export interface EventDrawerProps {
  readonly selection: AtlasSelection;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSelectOverview: () => void;
  readonly onSelectEvent: (eventId: string) => void;
  readonly onSelectThread: (threadId: string) => void;
  readonly onSelectBrasil: (brasilId: DarcyBrasilId) => void;
  readonly onSelectIndigenous: (trunkId: IndigenousTrunkId) => void;
  readonly onSelectLens: (lensId: TheoreticalLensId) => void;
}

const PATTERN_LABELS: Record<string, string> = {
  waves: 'Ondas (hachura fluvial/litorânea)',
  hatch: 'Diagonal (hachura de planalto)',
  dots: 'Pontilhado (dispersão fluvial)',
  cross: 'Cruzado (fronteira norte)',
};

export function EventDrawer({
  selection,
  isOpen,
  onClose,
  onSelectOverview,
  onSelectEvent,
  onSelectThread,
  onSelectBrasil,
  onSelectIndigenous,
  onSelectLens,
}: EventDrawerProps) {
  if (!isOpen) return null;

  return (
    <aside
      aria-label="Painel editorial do Atlas"
      className="fixed inset-y-0 right-0 z-30 w-full max-w-[420px] lg:static lg:w-[410px] xl:w-[430px] shrink-0 border-l border-parchment-border bg-parchment flex flex-col shadow-xl lg:shadow-none"
    >
      {/* Barra superior do painel */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-5 py-3 border-b border-parchment-border bg-parchment-surface/75">
        {selection.kind !== 'overview' ? (
          <button
            type="button"
            onClick={onSelectOverview}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Panorama do Atlas</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            <Compass className="w-3.5 h-3.5 text-terracotta" />
            <span>Guia Editorial</span>
          </span>
        )}

        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-ink-muted hover:bg-parchment-surface hover:text-ink transition-colors"
          aria-label="Recolher painel editorial"
          title="Recolher painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Corpo com rolagem interna suave */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {selection.kind === 'overview' && (
          <OverviewContent
            onSelectLens={onSelectLens}
            onSelectThread={onSelectThread}
            onSelectBrasil={onSelectBrasil}
            onSelectIndigenous={onSelectIndigenous}
          />
        )}

        {selection.kind === 'event' && (
          <EventDetailContent
            eventId={selection.eventId}
            onSelectEvent={onSelectEvent}
            onSelectLens={onSelectLens}
            onSelectBrasil={onSelectBrasil}
            onSelectThread={onSelectThread}
          />
        )}

        {selection.kind === 'thread' && (
          <ThreadDetailContent
            threadId={selection.threadId}
            onSelectEvent={onSelectEvent}
            onSelectLens={onSelectLens}
          />
        )}

        {selection.kind === 'brasil' && (
          <BrasilDetailContent
            brasilId={selection.brasilId}
            onSelectEvent={onSelectEvent}
          />
        )}

        {selection.kind === 'indigenous' && (
          <IndigenousDetailContent trunkId={selection.trunkId} />
        )}

        {selection.kind === 'lens' && (
          <LensDetailContent
            lensId={selection.lensId}
            onSelectEvent={onSelectEvent}
          />
        )}
      </div>
    </aside>
  );
}

/* =========================================================================
 * 1. PANORAMA GERAL (overview)
 * ========================================================================= */
function OverviewContent({
  onSelectLens,
  onSelectThread,
  onSelectBrasil,
  onSelectIndigenous,
}: {
  readonly onSelectLens: (id: TheoreticalLensId) => void;
  readonly onSelectThread: (id: string) => void;
  readonly onSelectBrasil: (id: DarcyBrasilId) => void;
  readonly onSelectIndigenous: (id: IndigenousTrunkId) => void;
}) {
  const buarqueLenses = THEORETICAL_LENSES.filter(
    (l) => l.author === 'sergio_buarque'
  );
  const darcyLenses = THEORETICAL_LENSES.filter(
    (l) => l.author === 'darcy_ribeiro'
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          Interpretação Cartográfica
        </p>
        <h2 className="font-serif text-2xl font-semibold text-ink leading-tight mt-1">
          Como o Brasil se tornou o Brasil
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mt-2">
          Explore 21 marcos históricos entre Colônia, Império e República para
          observar como fronteiras, ciclos econômicos, matrizes étnicas e
          estruturas de poder moldaram o território e ecoam no país
          contemporâneo.
        </p>
      </div>

      {/* 6 Lentes Teóricas */}
      <section className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-terracotta" />
          <span>Lentes Teóricas</span>
        </h3>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-ink">
            Sérgio Buarque de Holanda{' '}
            <span className="font-normal italic text-ink-muted">
              · Raízes do Brasil (1936)
            </span>
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {buarqueLenses.map((lens) => (
              <button
                key={lens.id}
                type="button"
                onClick={() => onSelectLens(lens.id)}
                className="group flex items-center justify-between gap-2 rounded-md border border-parchment-border bg-parchment-surface/65 px-3 py-2 text-left hover:border-terracotta/50 hover:bg-parchment-surface transition-colors"
              >
                <span className="text-xs font-medium text-ink">
                  {lens.title}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-terracotta shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-semibold text-ink">
            Darcy Ribeiro{' '}
            <span className="font-normal italic text-ink-muted">
              · O Povo Brasileiro (1995)
            </span>
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {darcyLenses.map((lens) => (
              <button
                key={lens.id}
                type="button"
                onClick={() => onSelectLens(lens.id)}
                className="group flex items-center justify-between gap-2 rounded-md border border-parchment-border bg-parchment-surface/65 px-3 py-2 text-left hover:border-forest/50 hover:bg-parchment-surface transition-colors"
              >
                <span className="text-xs font-medium text-ink">
                  {lens.title}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-forest shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Fios de Continuidade */}
      <section className="space-y-2.5 pt-2 border-t border-parchment-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-indigo-atlas" />
          <span>Fios de Continuidade</span>
        </h3>
        <div className="space-y-1.5">
          {CONTINUITY_THREADS.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => onSelectThread(thread.id)}
              className="group w-full flex items-start justify-between gap-2 rounded-md border border-parchment-border bg-parchment-surface/50 px-3 py-2 text-left hover:bg-parchment-surface transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: thread.color }}
                  />
                  <span className="text-xs font-semibold text-ink truncate">
                    {thread.title}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">
                  {thread.subtitle}
                </p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-ink shrink-0 mt-0.5" />
            </button>
          ))}
        </div>
      </section>

      {/* Os 5 Brasis de Darcy Ribeiro */}
      <section className="space-y-2.5 pt-2 border-t border-parchment-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Os 5 Brasis (Darcy Ribeiro)
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {DARCY_BRASIS.map((brasil) => (
            <button
              key={brasil.id}
              type="button"
              onClick={() => onSelectBrasil(brasil.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-parchment-border bg-parchment-surface/70 px-2.5 py-1 text-xs font-medium text-ink hover:bg-parchment-surface transition-colors"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: brasil.color }}
              />
              <span>{brasil.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4 Matrizes Indígenas */}
      <section className="space-y-2.5 pt-2 border-t border-parchment-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted flex items-center gap-1.5">
          <Trees className="w-3.5 h-3.5 text-forest" />
          <span>Matrizes Indígenas Originárias</span>
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {INDIGENOUS_MATRICES.map((matrix) => (
            <button
              key={matrix.id}
              type="button"
              onClick={() => onSelectIndigenous(matrix.id)}
              className="rounded-md border border-parchment-border bg-parchment-surface/60 px-2.5 py-2 text-left hover:bg-parchment-surface transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: matrix.color }}
                />
                <span className="text-xs font-semibold text-ink truncate">
                  {matrix.name}
                </span>
              </div>
              <p className="text-[10px] text-ink-muted mt-0.5 truncate">
                {matrix.peoplesExamples.slice(0, 3).join(', ')}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
 * 2. FICHA DE MARCO HISTÓRICO (event)
 * ========================================================================= */
function EventDetailContent({
  eventId,
  onSelectEvent,
  onSelectLens,
  onSelectBrasil,
  onSelectThread,
}: {
  readonly eventId: string;
  readonly onSelectEvent: (id: string) => void;
  readonly onSelectLens: (id: TheoreticalLensId) => void;
  readonly onSelectBrasil: (id: DarcyBrasilId) => void;
  readonly onSelectThread: (id: string) => void;
}) {
  const event = getEventById(eventId);
  if (!event) {
    return (
      <p className="text-sm text-ink-muted">Marco histórico não encontrado.</p>
    );
  }

  const era = ERAS[event.era];
  const symbolMeta = MAP_SYMBOLS[event.symbol];
  const brasil = event.darcyBrasilId
    ? getDarcyBrasilById(event.darcyBrasilId)
    : undefined;
  const threads = getThreadsForEvent(event.id);
  const relatedEvents = event.relatedEventIds
    .map((id) => getEventById(id))
    .filter((ev): ev is NonNullable<typeof ev> => Boolean(ev));

  const buarqueReadings = event.theoreticalReadings.filter(
    (r) => r.author === 'sergio_buarque'
  );
  const darcyReadings = event.theoreticalReadings.filter(
    (r) => r.author === 'darcy_ribeiro'
  );

  return (
    <article className="space-y-5">
      {/* Cabeçalho do Marco */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-parchment"
            style={{ backgroundColor: era.color }}
          >
            <MapSymbol symbol={event.symbol} size={11} />
            <span>{era.shortLabel}</span>
          </span>
          <span className="text-xs font-bold text-ink">{event.yearLabel}</span>
          <span className="text-[11px] text-ink-muted">
            · {symbolMeta.label}
          </span>
        </div>

        <h2 className="font-serif text-2xl font-semibold leading-snug text-ink mt-2">
          {event.title}
        </h2>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted mt-1.5">
          <span className="inline-flex items-center gap-1 font-medium text-ink">
            <MapPin className="w-3.5 h-3.5 text-terracotta" />
            {event.locationName}
          </span>
          <span>({event.stateCodes.join(', ')})</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {event.dimensions.map((dimId) => (
            <span
              key={dimId}
              className="rounded border border-parchment-border bg-parchment-surface px-2 py-0.5 text-[10px] font-medium text-ink-muted"
            >
              {DIMENSIONS[dimId].label}
            </span>
          ))}
        </div>
      </div>

      {/* Contexto Histórico */}
      <section className="space-y-1.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Contexto Histórico
        </h3>
        <p className="text-sm text-ink leading-relaxed font-medium">
          {event.summary}
        </p>
        <p className="text-xs text-ink-muted leading-relaxed">
          {event.historicalContext}
        </p>
      </section>

      {/* Leituras Teóricas separadas por autor */}
      <section className="space-y-3 pt-2 border-t border-parchment-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-terracotta" />
          <span>Leituras Teóricas</span>
        </h3>

        {buarqueReadings.map((reading) => (
          <div
            key={`sb-${reading.lensId}`}
            className="rounded-md border border-terracotta/30 bg-terracotta/[0.05] p-3 space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-terracotta">
                  Sérgio Buarque de Holanda · Raízes do Brasil
                </p>
                <p className="font-serif text-base font-semibold text-ink">
                  {reading.conceptLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectLens(reading.lensId)}
                className="shrink-0 inline-flex items-center gap-0.5 text-[11px] font-medium text-terracotta hover:underline"
              >
                <span>Lente</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              {reading.analysis}
            </p>
          </div>
        ))}

        {darcyReadings.map((reading) => (
          <div
            key={`dr-${reading.lensId}`}
            className="rounded-md border border-forest/30 bg-forest/[0.05] p-3 space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-forest">
                  Darcy Ribeiro · O Povo Brasileiro
                </p>
                <p className="font-serif text-base font-semibold text-ink">
                  {reading.conceptLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectLens(reading.lensId)}
                className="shrink-0 inline-flex items-center gap-0.5 text-[11px] font-medium text-forest hover:underline"
              >
                <span>Lente</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              {reading.analysis}
            </p>
          </div>
        ))}
      </section>

      {/* Bloco em destaque: Reflexos no Brasil de Hoje */}
      <section className="rounded-lg border border-ochre/45 bg-ochre/10 p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
          <Sparkles className="w-3.5 h-3.5 text-ochre" />
          <span>Reflexos no Brasil de Hoje</span>
        </div>
        <h4 className="font-serif text-lg font-semibold text-ink leading-snug">
          {event.presentDayBridge.headline}
        </h4>
        <p className="text-xs text-ink-muted leading-relaxed">
          {event.presentDayBridge.summary}
        </p>
        <ul className="space-y-1 pt-1">
          {event.presentDayBridge.indicators.map((ind, idx) => (
            <li
              key={idx}
              className="flex items-start gap-1.5 text-[11px] text-ink"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ochre shrink-0" />
              <span>{ind}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Brasil de Darcy associado */}
      {brasil && (
        <section className="pt-2 border-t border-parchment-border">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-1.5">
            Área Cultural · Os 5 Brasis
          </p>
          <button
            type="button"
            onClick={() => onSelectBrasil(brasil.id)}
            className="w-full flex items-center justify-between gap-2 rounded-md border border-parchment-border bg-parchment-surface/70 px-3 py-2 text-left hover:bg-parchment-surface transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: brasil.color }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink">{brasil.name}</p>
                <p className="text-[11px] text-ink-muted truncate">
                  {brasil.subtitle}
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
          </button>
        </section>
      )}

      {/* Fios de Continuidade */}
      {threads.length > 0 && (
        <section className="space-y-1.5 pt-2 border-t border-parchment-border">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Fios de Continuidade
          </p>
          <div className="space-y-1.5">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => onSelectThread(thread.id)}
                className="w-full flex items-center justify-between gap-2 rounded-md border border-parchment-border bg-parchment-surface/50 px-3 py-2 text-left hover:bg-parchment-surface transition-colors"
              >
                <span className="flex items-center gap-2 text-xs font-medium text-ink">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: thread.color }}
                  />
                  <span>{thread.title}</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Marcos Relacionados */}
      {relatedEvents.length > 0 && (
        <section className="space-y-1.5 pt-2 border-t border-parchment-border">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Marcos Relacionados
          </p>
          <div className="space-y-1">
            {relatedEvents.map((rel) => (
              <button
                key={rel.id}
                type="button"
                onClick={() => onSelectEvent(rel.id)}
                className="w-full flex items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left hover:bg-parchment-surface transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: ERAS[rel.era].color }}
                  />
                  <span className="text-xs font-semibold text-ink-muted shrink-0">
                    {rel.year}
                  </span>
                  <span className="text-xs text-ink truncate">
                    {rel.shortTitle}
                  </span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

/* =========================================================================
 * 3. FICHA DE FIO DE CONTINUIDADE (thread)
 * ========================================================================= */
function ThreadDetailContent({
  threadId,
  onSelectEvent,
  onSelectLens,
}: {
  readonly threadId: string;
  readonly onSelectEvent: (id: string) => void;
  readonly onSelectLens: (id: TheoreticalLensId) => void;
}) {
  const thread = getThreadById(threadId);
  if (!thread) {
    return (
      <p className="text-sm text-ink-muted">
        Fio de continuidade não encontrado.
      </p>
    );
  }

  const threadEvents = thread.eventIds
    .map((id) => getEventById(id))
    .filter((ev): ev is NonNullable<typeof ev> => Boolean(ev));

  return (
    <article className="space-y-5">
      <div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-parchment"
          style={{ backgroundColor: thread.color }}
        >
          <GitBranch className="w-3 h-3" />
          <span>Fio de Continuidade</span>
        </span>
        <h2 className="font-serif text-2xl font-semibold text-ink leading-snug mt-2">
          {thread.title}
        </h2>
        <p className="text-xs font-medium text-ink-muted mt-0.5">
          {thread.subtitle}
        </p>
      </div>

      <p className="text-xs text-ink-muted leading-relaxed">
        {thread.description}
      </p>

      <div className="rounded-lg border border-ochre/40 bg-ochre/10 p-3.5 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
          Síntese no Brasil Contemporâneo
        </p>
        <p className="text-xs text-ink-muted leading-relaxed">
          {thread.presentDaySynthesis}
        </p>
      </div>

      {/* Lentes associadas */}
      <div className="flex flex-wrap gap-1.5">
        {thread.lenses.map((lensId) => {
          const lens = getLensById(lensId);
          if (!lens) return null;
          return (
            <button
              key={lensId}
              type="button"
              onClick={() => onSelectLens(lensId)}
              className="rounded-full border border-parchment-border bg-parchment-surface px-2.5 py-1 text-[11px] font-medium text-ink hover:border-terracotta/50 transition-colors"
            >
              {lens.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Linha vertical cronológica */}
      <section className="space-y-2 pt-2 border-t border-parchment-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Trajetória Cronológica ({threadEvents.length} marcos)
        </h3>
        <ol className="relative border-l-2 border-parchment-border ml-2 pl-4 space-y-3">
          {threadEvents.map((ev) => (
            <li key={ev.id} className="relative">
              <span
                className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full border-2 border-parchment"
                style={{ backgroundColor: ERAS[ev.era].color }}
              />
              <button
                type="button"
                onClick={() => onSelectEvent(ev.id)}
                className="group w-full text-left rounded-md border border-parchment-border bg-parchment-surface/55 p-2.5 hover:bg-parchment-surface transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-ink">
                    {ev.yearLabel} · {ERAS[ev.era].shortLabel}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted group-hover:text-ink" />
                </div>
                <p className="font-serif text-base font-semibold text-ink leading-snug mt-0.5">
                  {ev.title}
                </p>
                <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-2">
                  {ev.summary}
                </p>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

/* =========================================================================
 * 4. FICHA DE UM DOS 5 BRASIS (brasil)
 * ========================================================================= */
function BrasilDetailContent({
  brasilId,
  onSelectEvent,
}: {
  readonly brasilId: DarcyBrasilId;
  readonly onSelectEvent: (id: string) => void;
}) {
  const brasil = getDarcyBrasilById(brasilId);
  if (!brasil) {
    return (
      <p className="text-sm text-ink-muted">Área cultural não encontrada.</p>
    );
  }

  const transitionStates = DARCY_BRASIS_TRANSITION_STATES[brasil.id];
  const relatedEvents = brasil.relatedEventIds
    .map((id) => getEventById(id))
    .filter((ev): ev is NonNullable<typeof ev> => Boolean(ev));

  return (
    <article className="space-y-5">
      <div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-parchment"
          style={{ backgroundColor: brasil.color }}
        >
          Os 5 Brasis · Darcy Ribeiro
        </span>
        <h2 className="font-serif text-2xl font-semibold text-ink leading-snug mt-2">
          {brasil.name}
        </h2>
        <p className="text-xs font-medium text-ink-muted mt-0.5">
          {brasil.subtitle}
        </p>
      </div>

      <p className="text-xs text-ink-muted leading-relaxed">{brasil.summary}</p>

      <div className="space-y-3 pt-1">
        <div className="rounded-md border border-parchment-border bg-parchment-surface/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Base Econômica
          </p>
          <p className="text-xs text-ink leading-relaxed mt-1">
            {brasil.economicBase}
          </p>
        </div>

        <div className="rounded-md border border-parchment-border bg-parchment-surface/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Matriz Cultural
          </p>
          <p className="text-xs text-ink leading-relaxed mt-1">
            {brasil.culturalMatrix}
          </p>
        </div>

        <div className="rounded-md border border-ochre/40 bg-ochre/10 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink">
            Eco no Brasil Contemporâneo
          </p>
          <p className="text-xs text-ink-muted leading-relaxed mt-1">
            {brasil.presentDayEcho}
          </p>
        </div>
      </div>

      {/* UFs principais e zonas de transição */}
      <section className="space-y-2 pt-2 border-t border-parchment-border">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-1">
            UFs Principais no Mapa
          </p>
          <div className="flex flex-wrap gap-1">
            {brasil.states.map((uf) => (
              <span
                key={uf}
                className="rounded border border-parchment-border bg-parchment-surface px-2 py-0.5 text-[11px] font-semibold text-ink"
              >
                {uf}
              </span>
            ))}
          </div>
        </div>

        {transitionStates.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-1">
              Áreas de Transição Cultural
            </p>
            <div className="flex flex-wrap gap-1">
              {transitionStates.map((uf) => (
                <span
                  key={uf}
                  className="rounded border border-dashed border-parchment-border bg-parchment px-2 py-0.5 text-[11px] font-medium text-ink-muted"
                >
                  {uf}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Marcos relacionados */}
      {relatedEvents.length > 0 && (
        <section className="space-y-1.5 pt-2 border-t border-parchment-border">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Marcos Históricos Relacionados
          </p>
          <div className="space-y-1">
            {relatedEvents.map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => onSelectEvent(ev.id)}
                className="w-full flex items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left hover:bg-parchment-surface transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: ERAS[ev.era].color }}
                  />
                  <span className="text-xs font-semibold text-ink-muted shrink-0">
                    {ev.year}
                  </span>
                  <span className="text-xs text-ink truncate">
                    {ev.shortTitle}
                  </span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

/* =========================================================================
 * 5. FICHA DE MATRIZ INDÍGENA (indigenous)
 * ========================================================================= */
function IndigenousDetailContent({
  trunkId,
}: {
  readonly trunkId: IndigenousTrunkId;
}) {
  const matrix = getIndigenousMatrixById(trunkId);
  if (!matrix) {
    return (
      <p className="text-sm text-ink-muted">Matriz indígena não encontrada.</p>
    );
  }

  return (
    <article className="space-y-5">
      <div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-parchment"
          style={{ backgroundColor: matrix.color }}
        >
          <Trees className="w-3 h-3" />
          <span>Matriz Indígena Originária</span>
        </span>
        <h2 className="font-serif text-2xl font-semibold text-ink leading-snug mt-2">
          {matrix.name}
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">{matrix.regionsLabel}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {matrix.peoplesExamples.map((people) => (
          <span
            key={people}
            className="rounded-full border border-parchment-border bg-parchment-surface px-2.5 py-0.5 text-[11px] font-medium text-ink"
          >
            {people}
          </span>
        ))}
      </div>

      <p className="text-xs text-ink-muted leading-relaxed">{matrix.summary}</p>

      <div className="rounded-md border border-parchment-border bg-parchment-surface/60 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          Legado Cultural &amp; Ecológico
        </p>
        <p className="text-xs text-ink leading-relaxed mt-1">
          {matrix.culturalLegacy}
        </p>
      </div>

      <div className="rounded-md border border-ochre/40 bg-ochre/10 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink">
          Presença Contemporânea
        </p>
        <p className="text-xs text-ink-muted leading-relaxed mt-1">
          {matrix.presentDayPresence}
        </p>
      </div>

      <div className="pt-2 border-t border-parchment-border text-[11px] text-ink-muted space-y-1">
        <p>
          <strong className="text-ink">Padrão cartográfico:</strong>{' '}
          {PATTERN_LABELS[matrix.pattern] ?? matrix.pattern}
        </p>
        <p>
          <strong className="text-ink">UFs de presença histórica:</strong>{' '}
          {matrix.states.join(', ')}
        </p>
      </div>
    </article>
  );
}

/* =========================================================================
 * 6. FICHA DE LENTE TEÓRICA (lens)
 * ========================================================================= */
function LensDetailContent({
  lensId,
  onSelectEvent,
}: {
  readonly lensId: TheoreticalLensId;
  readonly onSelectEvent: (id: string) => void;
}) {
  const lens = getLensById(lensId);
  if (!lens) {
    return (
      <p className="text-sm text-ink-muted">Lente teórica não encontrada.</p>
    );
  }

  const events = getEventsForLens(lens.id);

  return (
    <article className="space-y-5">
      <div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-parchment"
          style={{ backgroundColor: lens.accentColor }}
        >
          <BookOpen className="w-3 h-3" />
          <span>{lens.authorName}</span>
        </span>
        <h2 className="font-serif text-2xl font-semibold text-ink leading-snug mt-2">
          {lens.title}
        </h2>
        <p className="text-xs italic text-ink-muted mt-0.5">
          {lens.workTitle} ({lens.workYear})
        </p>
      </div>

      <section className="space-y-1.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Conceito Central
        </h3>
        <p className="text-xs text-ink leading-relaxed">{lens.definition}</p>
      </section>

      <section className="rounded-lg border border-ochre/40 bg-ochre/10 p-3.5 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
          Relevância no Brasil Contemporâneo
        </p>
        <p className="text-xs text-ink-muted leading-relaxed">
          {lens.contemporaryRelevance}
        </p>
      </section>

      <section className="space-y-2 pt-2 border-t border-parchment-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Marcos Analisados por Esta Lente ({events.length})
        </h3>
        <div className="space-y-1.5">
          {events.map((ev) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => onSelectEvent(ev.id)}
              className="w-full flex items-center justify-between gap-2 rounded-md border border-parchment-border bg-parchment-surface/55 px-3 py-2 text-left hover:bg-parchment-surface transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: ERAS[ev.era].color }}
                />
                <span className="text-xs font-semibold text-ink-muted shrink-0">
                  {ev.year}
                </span>
                <span className="text-xs font-medium text-ink truncate">
                  {ev.title}
                </span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

export default EventDrawer;
