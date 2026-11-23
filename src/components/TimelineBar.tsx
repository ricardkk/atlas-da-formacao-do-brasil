import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ERAS, TERRITORIAL_SNAPSHOTS } from '../data';
import type { HistoricalEvent, TerritorialSnapshotId } from '../types';

export interface TimelineBarProps {
  readonly events: readonly HistoricalEvent[];
  readonly selectedEventId: string | null;
  readonly activeSnapshot: TerritorialSnapshotId;
  readonly showTerritorialOverlay: boolean;
  readonly onSelectSnapshot: (snapshotId: TerritorialSnapshotId) => void;
  readonly onSelectEvent: (eventId: string) => void;
}

export function TimelineBar({
  events,
  selectedEventId,
  activeSnapshot,
  showTerritorialOverlay,
  onSelectSnapshot,
  onSelectEvent,
}: TimelineBarProps) {
  const activeSnapshotIndex = Math.max(
    0,
    TERRITORIAL_SNAPSHOTS.findIndex((s) => s.id === activeSnapshot)
  );

  const selectedEventIndex = selectedEventId
    ? events.findIndex((ev) => ev.id === selectedEventId)
    : -1;

  const handleStep = (delta: -1 | 1) => {
    if (events.length === 0) return;
    if (selectedEventIndex === -1) {
      onSelectEvent(
        delta === 1 ? events[0].id : events[events.length - 1].id
      );
      return;
    }
    const nextIndex =
      (selectedEventIndex + delta + events.length) % events.length;
    onSelectEvent(events[nextIndex].id);
  };

  return (
    <section
      aria-label="Linha do tempo e recortes territoriais"
      className="shrink-0 border-t border-parchment-border bg-parchment-surface/95 backdrop-blur-sm px-4 py-2.5"
    >
      <div className="flex flex-col gap-2">
        {/* Linha 1: Time Slider de Recortes Territoriais */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted shrink-0">
              Fronteiras
            </span>
            <input
              type="range"
              min={0}
              max={TERRITORIAL_SNAPSHOTS.length - 1}
              step={1}
              value={activeSnapshotIndex}
              onChange={(e) => {
                const idx = Number(e.target.value);
                const snap = TERRITORIAL_SNAPSHOTS[idx];
                if (snap) onSelectSnapshot(snap.id);
              }}
              aria-label="Selecionar recorte territorial histórico"
              className="w-28 sm:w-36 accent-terracotta cursor-pointer"
            />
          </div>

          <div
            className="flex flex-wrap items-center gap-1"
            role="group"
            aria-label="Marcos territoriais"
          >
            {TERRITORIAL_SNAPSHOTS.map((snap) => {
              const isActive =
                showTerritorialOverlay && activeSnapshot === snap.id;
              return (
                <button
                  key={snap.id}
                  type="button"
                  onClick={() => onSelectSnapshot(snap.id)}
                  aria-pressed={isActive}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    isActive
                      ? 'text-parchment shadow-sm'
                      : 'text-ink-muted hover:text-ink hover:bg-parchment'
                  }`}
                  style={
                    isActive ? { backgroundColor: snap.color } : undefined
                  }
                >
                  {snap.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Linha 2: Trilha de Marcos Históricos + Anterior / Próximo */}
        <div className="flex items-center gap-2 pt-1 border-t border-parchment-border/70">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={events.length === 0}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-parchment-border bg-parchment text-ink hover:bg-parchment-surface disabled:opacity-40 transition-colors"
            aria-label="Marco histórico anterior"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative flex-1 flex items-center gap-1 overflow-x-auto py-1 px-1">
            {events.length === 0 ? (
              <p className="text-xs text-ink-muted italic px-2">
                Nenhum marco histórico corresponde aos filtros atuais.
              </p>
            ) : (
              <div className="relative flex items-center justify-between w-full min-w-[420px] px-1">
                {/* Linha horizontal de fundo */}
                <div
                  className="pointer-events-none absolute left-2 right-2 top-1/2 -translate-y-1/2 h-px bg-parchment-border"
                  aria-hidden="true"
                />

                {events.map((event) => {
                  const isSelected = event.id === selectedEventId;
                  const eraColor = ERAS[event.era].color;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onSelectEvent(event.id)}
                      title={`${event.yearLabel} — ${event.title}`}
                      aria-label={`${event.yearLabel}: ${event.title}`}
                      aria-current={isSelected ? 'step' : undefined}
                      className="group relative z-10 flex flex-col items-center focus:outline-none px-0.5"
                    >
                      <span
                        className={`block rounded-full border-2 border-parchment transition-transform duration-150 ${
                          isSelected
                            ? 'h-3.5 w-3.5 scale-110 ring-2 ring-offset-1 ring-ink/30'
                            : 'h-2.5 w-2.5 group-hover:scale-125'
                        }`}
                        style={{ backgroundColor: eraColor }}
                      />
                      <span
                        className={`mt-1 text-[10px] leading-none transition-colors ${
                          isSelected
                            ? 'font-bold text-ink'
                            : 'text-ink-muted group-hover:text-ink hidden md:inline'
                        }`}
                      >
                        {event.year}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={events.length === 0}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-parchment-border bg-parchment text-ink hover:bg-parchment-surface disabled:opacity-40 transition-colors"
            aria-label="Próximo marco histórico"
            title="Próximo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default TimelineBar;
