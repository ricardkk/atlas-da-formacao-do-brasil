import { useCallback, useMemo, useState } from 'react';
import { EventDrawer } from './components/EventDrawer';
import { HeaderFilters } from './components/HeaderFilters';
import { MapCanvas } from './components/MapCanvas';
import { TimelineBar } from './components/TimelineBar';
import { HISTORICAL_EVENTS } from './data';
import type {
  AtlasFilterState,
  AtlasSelection,
  DarcyBrasilId,
  DimensionId,
  EraId,
  IndigenousTrunkId,
  MapLayerState,
  TerritorialSnapshotId,
  TheoreticalLensId,
} from './types';
import {
  DEFAULT_FILTERS,
  filterHistoricalEvents,
  getEventById,
} from './utils/filters';

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

function getDefaultSnapshotForEra(era: EraId): TerritorialSnapshotId {
  switch (era) {
    case 'colonia':
      return 'madri_1750';
    case 'imperio':
      return 'imperio_1850';
    case 'republica':
      return 'republica_1889';
  }
}

export function App() {
  const [filters, setFilters] = useState<AtlasFilterState>(DEFAULT_FILTERS);
  const [layers, setLayers] = useState<MapLayerState>(INITIAL_LAYERS);
  const [selection, setSelection] = useState<AtlasSelection>({
    kind: 'overview',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  const visibleEvents = useMemo(
    () => filterHistoricalEvents(HISTORICAL_EVENTS, filters),
    [filters]
  );

  const selectedEventId =
    selection.kind === 'event' ? selection.eventId : null;
  const selectedBrasilId =
    selection.kind === 'brasil' ? selection.brasilId : filters.selectedBrasilId;
  const selectedThreadId =
    selection.kind === 'thread'
      ? selection.threadId
      : filters.selectedThreadId;
  const selectedIndigenousId =
    selection.kind === 'indigenous' ? selection.trunkId : null;

  const handleToggleLayer = useCallback(
    (key: Exclude<keyof MapLayerState, 'activeTerritorialSnapshot'>) => {
      setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  const handleSelectSnapshot = useCallback(
    (snapshotId: TerritorialSnapshotId) => {
      setLayers((prev) => ({
        ...prev,
        showTerritorialOverlay: true,
        activeTerritorialSnapshot: snapshotId,
      }));
    },
    []
  );

  const handleSelectEvent = useCallback((eventId: string) => {
    const ev = getEventById(eventId);
    setSelection({ kind: 'event', eventId });
    setIsDrawerOpen(true);
    if (ev) {
      const targetSnapshot =
        ev.territorialSnapshotId ?? getDefaultSnapshotForEra(ev.era);
      setLayers((prev) => ({
        ...prev,
        showTerritorialOverlay: true,
        activeTerritorialSnapshot: targetSnapshot,
      }));
    }
  }, []);

  const handleSelectThread = useCallback((threadId: string) => {
    setSelection({ kind: 'thread', threadId });
    setIsDrawerOpen(true);
    setLayers((prev) => ({ ...prev, showContinuityArcs: true }));
  }, []);

  const handleFilterThread = useCallback((threadId: string | null) => {
    setFilters((prev) => ({ ...prev, selectedThreadId: threadId }));
    if (threadId !== null) {
      setLayers((prev) => ({ ...prev, showContinuityArcs: true }));
      setSelection({ kind: 'thread', threadId });
      setIsDrawerOpen(true);
    } else {
      setSelection((prev) =>
        prev.kind === 'thread' ? { kind: 'overview' } : prev
      );
    }
  }, []);

  const handleSelectBrasil = useCallback((brasilId: DarcyBrasilId) => {
    setSelection({ kind: 'brasil', brasilId });
    setIsDrawerOpen(true);
    setLayers((prev) => ({ ...prev, showDarcyBrasis: true }));
  }, []);

  const handleSelectIndigenous = useCallback((trunkId: IndigenousTrunkId) => {
    setSelection({ kind: 'indigenous', trunkId });
    setIsDrawerOpen(true);
    setLayers((prev) => ({ ...prev, showIndigenousMatrices: true }));
  }, []);

  const handleSelectLens = useCallback((lensId: TheoreticalLensId) => {
    setSelection({ kind: 'lens', lensId });
    setIsDrawerOpen(true);
  }, []);

  const handleChangeEra = useCallback((era: EraId | 'all') => {
    setFilters((prev) => ({ ...prev, selectedEra: era }));
  }, []);

  const handleChangeDimension = useCallback(
    (dimension: DimensionId | 'all') => {
      setFilters((prev) => ({ ...prev, selectedDimension: dimension }));
    },
    []
  );

  const handleChangeLens = useCallback((lens: TheoreticalLensId | 'all') => {
    setFilters((prev) => ({ ...prev, selectedLens: lens }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleGoOverview = useCallback(() => {
    setSelection({ kind: 'overview' });
    setIsDrawerOpen(true);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-parchment text-ink flex flex-col">
      <HeaderFilters
        filters={filters}
        layers={layers}
        visibleEventCount={visibleEvents.length}
        totalEventCount={HISTORICAL_EVENTS.length}
        isDrawerOpen={isDrawerOpen}
        onChangeEra={handleChangeEra}
        onChangeDimension={handleChangeDimension}
        onChangeLens={handleChangeLens}
        onInspectLens={handleSelectLens}
        onChangeThread={handleFilterThread}
        onToggleLayer={handleToggleLayer}
        onResetFilters={handleResetFilters}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        onGoOverview={handleGoOverview}
      />

      <div className="flex-1 min-h-0 flex relative overflow-hidden">
        {/* Coluna principal: Mapa Vetorial + Barra Cronológica */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 min-h-0 relative">
            <MapCanvas
              events={visibleEvents}
              layers={layers}
              selectedEventId={selectedEventId}
              selectedBrasilId={selectedBrasilId}
              selectedThreadId={selectedThreadId}
              selectedIndigenousId={selectedIndigenousId}
              onSelectEvent={handleSelectEvent}
              onSelectBrasil={handleSelectBrasil}
            />
          </div>

          <TimelineBar
            events={visibleEvents}
            selectedEventId={selectedEventId}
            activeSnapshot={layers.activeTerritorialSnapshot}
            showTerritorialOverlay={layers.showTerritorialOverlay}
            onSelectSnapshot={handleSelectSnapshot}
            onSelectEvent={handleSelectEvent}
          />
        </main>

        {/* Painel Lateral Editorial Contextual */}
        <EventDrawer
          selection={selection}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSelectOverview={handleGoOverview}
          onSelectEvent={handleSelectEvent}
          onSelectThread={handleSelectThread}
          onSelectBrasil={handleSelectBrasil}
          onSelectIndigenous={handleSelectIndigenous}
          onSelectLens={handleSelectLens}
        />
      </div>
    </div>
  );
}

export default App;
