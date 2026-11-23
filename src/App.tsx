import { useMemo, useState } from 'react';
import {
  Compass,
  GitBranch,
  Grid3X3,
  Layers,
  Map as MapIcon,
  Trees,
  Waves,
  X,
} from 'lucide-react';
import { MapCanvas } from './components/MapCanvas';
import { MapSymbol } from './components/MapSymbols';
import {
  DARCY_BRASIS,
  ERAS,
  HISTORICAL_EVENTS,
  TERRITORIAL_SNAPSHOTS,
} from './data';
import type {
  DarcyBrasilId,
  MapLayerState,
  TerritorialSnapshotId,
} from './types';

const INITIAL_LAYERS: MapLayerState = {
  showEvents: true,
  showDarcyBrasis: false,
  showIndigenousMatrices: false,
  showRivers: true,
  showGraticule: true,
  showContinuityArcs: false,
  showTerritorialOverlay: true,
  activeTerritorialSnapshot: 'republica_1889',
};

export function App() {
  const [layers, setLayers] = useState<MapLayerState>(INITIAL_LAYERS);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedBrasilId, setSelectedBrasilId] =
    useState<DarcyBrasilId | null>(null);

  const selectedEvent = useMemo(
    () => HISTORICAL_EVENTS.find((ev) => ev.id === selectedEventId) ?? null,
    [selectedEventId]
  );

  const selectedBrasil = useMemo(
    () => DARCY_BRASIS.find((b) => b.id === selectedBrasilId) ?? null,
    [selectedBrasilId]
  );

  const toggleLayer = (
    key: Exclude<keyof MapLayerState, 'activeTerritorialSnapshot'>
  ) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setSnapshot = (snapshotId: TerritorialSnapshotId) => {
    setLayers((prev) => ({
      ...prev,
      showTerritorialOverlay: true,
      activeTerritorialSnapshot: snapshotId,
    }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-parchment text-ink flex flex-col">
      {/* Barra superior provisória de controle das camadas cartográficas */}
      <header className="shrink-0 border-b border-parchment-border bg-parchment-surface/95 backdrop-blur-sm px-4 py-2.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Compass
              className="w-5 h-5 text-terracotta shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <div>
              <h1 className="font-serif text-xl font-semibold leading-none text-ink">
                Atlas da Formação do Brasil
              </h1>
              <p className="text-[11px] text-ink-muted mt-0.5">
                {HISTORICAL_EVENTS.length} marcos históricos · 27 UFs · Malha IBGE
              </p>
            </div>
          </div>

          {/* Seletor de Recorte Territorial Histórico */}
          <div
            className="flex flex-wrap items-center gap-1 rounded-md border border-parchment-border bg-parchment p-1"
            role="group"
            aria-label="Recortes territoriais históricos"
          >
            {TERRITORIAL_SNAPSHOTS.map((snap) => {
              const isActive =
                layers.showTerritorialOverlay &&
                layers.activeTerritorialSnapshot === snap.id;
              return (
                <button
                  key={snap.id}
                  type="button"
                  onClick={() => setSnapshot(snap.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-ink text-parchment shadow-sm'
                      : 'text-ink-muted hover:text-ink hover:bg-parchment-surface'
                  }`}
                >
                  {snap.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Toggles de Camadas */}
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="Camadas cartográficas"
          >
            <LayerToggleButton
              active={layers.showDarcyBrasis}
              onClick={() => toggleLayer('showDarcyBrasis')}
              icon={<MapIcon className="w-3.5 h-3.5" />}
              label="5 Brasis"
            />
            <LayerToggleButton
              active={layers.showIndigenousMatrices}
              onClick={() => toggleLayer('showIndigenousMatrices')}
              icon={<Trees className="w-3.5 h-3.5" />}
              label="Matrizes Indígenas"
            />
            <LayerToggleButton
              active={layers.showRivers}
              onClick={() => toggleLayer('showRivers')}
              icon={<Waves className="w-3.5 h-3.5" />}
              label="Rios"
            />
            <LayerToggleButton
              active={layers.showContinuityArcs}
              onClick={() => toggleLayer('showContinuityArcs')}
              icon={<GitBranch className="w-3.5 h-3.5" />}
              label="Continuidades"
            />
            <LayerToggleButton
              active={layers.showGraticule}
              onClick={() => toggleLayer('showGraticule')}
              icon={<Grid3X3 className="w-3.5 h-3.5" />}
              label="Retícula"
            />
            <LayerToggleButton
              active={layers.showTerritorialOverlay}
              onClick={() => toggleLayer('showTerritorialOverlay')}
              icon={<Layers className="w-3.5 h-3.5" />}
              label="Fronteiras"
            />
          </div>
        </div>
      </header>

      {/* Área principal do Mapa Vetorial */}
      <main className="relative flex-1 min-h-0">
        <MapCanvas
          events={HISTORICAL_EVENTS}
          layers={layers}
          selectedEventId={selectedEventId}
          selectedBrasilId={selectedBrasilId}
          selectedThreadId={null}
          onSelectEvent={(eventId) => {
            setSelectedBrasilId(null);
            setSelectedEventId(eventId);
          }}
          onSelectBrasil={(brasilId) => {
            setSelectedEventId(null);
            setSelectedBrasilId((prev) => (prev === brasilId ? null : brasilId));
          }}
        />

        {/* Cartão de resumo rápido do Evento selecionado */}
        {selectedEvent && (
          <aside className="absolute top-4 right-4 z-10 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-parchment-border bg-parchment/95 p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-parchment"
                  style={{ backgroundColor: ERAS[selectedEvent.era].color }}
                >
                  <MapSymbol symbol={selectedEvent.symbol} size={13} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {ERAS[selectedEvent.era].shortLabel} · {selectedEvent.yearLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEventId(null)}
                className="rounded p-1 text-ink-muted hover:bg-parchment-surface hover:text-ink"
                aria-label="Fechar resumo do marco"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="font-serif text-xl font-semibold leading-snug text-ink mt-2">
              {selectedEvent.title}
            </h2>
            <p className="text-xs font-medium text-ink-muted mt-0.5">
              {selectedEvent.locationName} ({selectedEvent.stateCodes.join(', ')})
            </p>
            <p className="text-sm text-ink-muted leading-relaxed mt-2.5">
              {selectedEvent.summary}
            </p>
            <div className="mt-3 pt-2.5 border-t border-parchment-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-terracotta">
                Ponte com o Brasil Contemporâneo
              </p>
              <p className="text-xs font-medium text-ink mt-0.5">
                {selectedEvent.presentDayBridge.headline}
              </p>
            </div>
          </aside>
        )}

        {/* Cartão de resumo rápido do Brasil de Darcy selecionado */}
        {!selectedEvent && selectedBrasil && (
          <aside className="absolute top-4 right-4 z-10 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-parchment-border bg-parchment/95 p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-parchment"
                style={{ backgroundColor: selectedBrasil.color }}
              >
                Os 5 Brasis · Darcy Ribeiro
              </span>
              <button
                type="button"
                onClick={() => setSelectedBrasilId(null)}
                className="rounded p-1 text-ink-muted hover:bg-parchment-surface hover:text-ink"
                aria-label="Fechar resumo do Brasil de Darcy"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="font-serif text-xl font-semibold leading-snug text-ink mt-2">
              {selectedBrasil.name}
            </h2>
            <p className="text-xs font-medium text-ink-muted mt-0.5">
              {selectedBrasil.subtitle}
            </p>
            <p className="text-sm text-ink-muted leading-relaxed mt-2.5">
              {selectedBrasil.summary}
            </p>
            <p className="text-[11px] text-ink-muted mt-2.5 pt-2 border-t border-parchment-border">
              <span className="font-semibold text-ink">UFs:</span>{' '}
              {selectedBrasil.states.join(', ')}
            </p>
          </aside>
        )}
      </main>
    </div>
  );
}

interface LayerToggleButtonProps {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly icon: React.ReactNode;
  readonly label: string;
}

function LayerToggleButton({
  active,
  onClick,
  icon,
  label,
}: LayerToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-terracotta/40 bg-terracotta/15 text-ink'
          : 'border-parchment-border bg-parchment text-ink-muted hover:text-ink hover:bg-parchment-surface'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default App;
