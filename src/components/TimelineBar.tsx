import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

interface TrackMetrics {
  readonly firstX: number;
  readonly spanWidth: number;
  readonly activeX: number | null;
}

export function TimelineBar({
  events,
  selectedEventId,
  activeSnapshot,
  showTerritorialOverlay,
  onSelectSnapshot,
  onSelectEvent,
}: TimelineBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [metrics, setMetrics] = useState<TrackMetrics>({
    firstX: 8,
    spanWidth: 0,
    activeX: null,
  });

  const activeSnapshotIndex = Math.max(
    0,
    TERRITORIAL_SNAPSHOTS.findIndex((s) => s.id === activeSnapshot)
  );

  const selectedEventIndex = selectedEventId
    ? events.findIndex((ev) => ev.id === selectedEventId)
    : -1;

  const selectedEvent =
    selectedEventIndex >= 0 ? events[selectedEventIndex] : null;
  const activeColor = selectedEvent
    ? ERAS[selectedEvent.era].color
    : '#B85336';

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

  // Mede posições reais dos marcos para deslizar o cursor e a barra de progresso via transform (GPU)
  useLayoutEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl || events.length === 0) {
      setMetrics({ firstX: 8, spanWidth: 0, activeX: null });
      return;
    }

    const measure = () => {
      const firstBtn = itemRefs.current.get(events[0].id);
      const lastBtn = itemRefs.current.get(events[events.length - 1].id);
      const activeBtn = selectedEventId
        ? itemRefs.current.get(selectedEventId)
        : undefined;

      const firstX = firstBtn
        ? firstBtn.offsetLeft + firstBtn.offsetWidth / 2
        : 8;
      const lastX = lastBtn
        ? lastBtn.offsetLeft + lastBtn.offsetWidth / 2
        : trackEl.clientWidth - 8;
      const activeX = activeBtn
        ? activeBtn.offsetLeft + activeBtn.offsetWidth / 2
        : null;

      setMetrics({
        firstX,
        spanWidth: Math.max(0, lastX - firstX),
        activeX,
      });
    };

    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(trackEl);
    return () => observer.disconnect();
  }, [events, selectedEventId]);

  // Garante visibilidade suave quando a trilha possui rolagem horizontal em telas menores
  useEffect(() => {
    if (!selectedEventId) return;
    const btn = itemRefs.current.get(selectedEventId);
    btn?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [selectedEventId]);

  const progressScale =
    metrics.activeX !== null && metrics.spanWidth > 0
      ? Math.min(1, Math.max(0, (metrics.activeX - metrics.firstX) / metrics.spanWidth))
      : 0;

  return (
    <section
      aria-label="Linha do tempo e recortes territoriais"
      className="relative z-20 shrink-0 border-t border-parchment-border bg-parchment-surface px-4 py-2.5"
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
            className="group inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-parchment-border bg-parchment text-ink hover:bg-parchment-surface disabled:opacity-40 transition-colors"
            aria-label="Marco histórico anterior"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5 group-active:-translate-x-1 motion-reduce:transition-none" />
          </button>

          <div className="relative flex-1 flex items-center gap-1 overflow-x-auto py-1 px-1">
            {events.length === 0 ? (
              <p className="text-xs text-ink-muted italic px-2">
                Nenhum marco histórico corresponde aos filtros atuais.
              </p>
            ) : (
              <div
                ref={trackRef}
                className="relative flex items-start justify-between w-full min-w-[420px] px-1"
              >
                {/* Linha horizontal base */}
                <div
                  className="pointer-events-none absolute top-2 -translate-y-1/2 h-[2px] bg-parchment-border rounded-full"
                  style={{
                    left: `${metrics.firstX}px`,
                    width: `${metrics.spanWidth}px`,
                  }}
                  aria-hidden="true"
                />

                {/* Barra de progresso animada via scaleX (GPU-only) */}
                {metrics.activeX !== null && metrics.spanWidth > 0 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-2 -translate-y-1/2 h-[2px] origin-left rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      left: `${metrics.firstX}px`,
                      width: `${metrics.spanWidth}px`,
                      backgroundColor: activeColor,
                      transform: `scaleX(${progressScale})`,
                    }}
                  />
                )}

                {/* Cursor viajante deslizante entre o marco anterior e o próximo (translate3d GPU-only) */}
                {metrics.activeX !== null && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-2 z-20 transition-transform duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      transform: `translate3d(${metrics.activeX}px, -50%, 0)`,
                    }}
                  >
                    <span
                      className="block -ml-[9px] h-[18px] w-[18px] rounded-full border-2 shadow-sm transition-colors duration-200"
                      style={{
                        borderColor: activeColor,
                        backgroundColor: 'rgba(245, 232, 213, 0.45)',
                      }}
                    />
                    <span
                      key={selectedEventId}
                      className="animate-timeline-arrival pointer-events-none absolute inset-0 -ml-[9px] h-[18px] w-[18px] rounded-full border"
                      style={{ borderColor: activeColor }}
                    />
                  </div>
                )}

                {events.map((event) => {
                  const isSelected = event.id === selectedEventId;
                  const eraColor = ERAS[event.era].color;
                  return (
                    <button
                      key={event.id}
                      ref={(el) => {
                        if (el) {
                          itemRefs.current.set(event.id, el);
                        } else {
                          itemRefs.current.delete(event.id);
                        }
                      }}
                      type="button"
                      onClick={() => onSelectEvent(event.id)}
                      title={`${event.yearLabel} — ${event.title}`}
                      aria-label={`${event.yearLabel}: ${event.title}`}
                      aria-current={isSelected ? 'step' : undefined}
                      className="group relative z-10 flex flex-col items-center focus:outline-none px-0.5"
                    >
                      <span className="flex h-4 items-center justify-center">
                        <span
                          className={`block rounded-full border-2 border-parchment transition-transform duration-200 motion-reduce:transition-none ${
                            isSelected
                              ? 'h-3 w-3 scale-110'
                              : 'h-2.5 w-2.5 group-hover:scale-125'
                          }`}
                          style={{ backgroundColor: eraColor }}
                        />
                      </span>
                      <span
                        className={`mt-0.5 text-[10px] leading-none transition-colors duration-200 ${
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
            className="group inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-parchment-border bg-parchment text-ink hover:bg-parchment-surface disabled:opacity-40 transition-colors"
            aria-label="Próximo marco histórico"
            title="Próximo"
          >
            <ChevronRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-active:translate-x-1 motion-reduce:transition-none" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default TimelineBar;
