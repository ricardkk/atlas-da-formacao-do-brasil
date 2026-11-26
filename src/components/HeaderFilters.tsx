import {
  BookOpen,
  Compass,
  GitBranch,
  Grid3X3,
  Map as MapIcon,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Trees,
  Waves,
} from 'lucide-react';
import {
  CONTINUITY_THREADS,
  DIMENSIONS,
  ERAS,
  THEORETICAL_LENSES,
} from '../data';
import type {
  AtlasFilterState,
  DimensionId,
  EraId,
  MapLayerState,
  TheoreticalLensId,
} from '../types';
import { hasActiveFilters } from '../utils/filters';
import {
  EditorialSelect,
  type EditorialSelectGroup,
  type EditorialSelectOption,
} from './EditorialSelect';

export interface HeaderFiltersProps {
  readonly filters: AtlasFilterState;
  readonly layers: MapLayerState;
  readonly visibleEventCount: number;
  readonly totalEventCount: number;
  readonly isDrawerOpen: boolean;
  readonly onChangeEra: (era: EraId | 'all') => void;
  readonly onChangeDimension: (dimension: DimensionId | 'all') => void;
  readonly onChangeLens: (lens: TheoreticalLensId | 'all') => void;
  readonly onInspectLens: (lensId: TheoreticalLensId) => void;
  readonly onChangeThread: (threadId: string | null) => void;
  readonly onToggleLayer: (
    layer: Exclude<keyof MapLayerState, 'activeTerritorialSnapshot'>
  ) => void;
  readonly onResetFilters: () => void;
  readonly onToggleDrawer: () => void;
  readonly onGoOverview: () => void;
}

const ERA_ORDER: readonly EraId[] = ['colonia', 'imperio', 'republica'];
const DIMENSION_ORDER: readonly DimensionId[] = [
  'economia',
  'cultura',
  'politica',
];

const LENS_GROUPS: readonly EditorialSelectGroup[] = [
  {
    label: 'Sérgio Buarque',
    subtitle: 'Raízes do Brasil',
    options: THEORETICAL_LENSES.filter((l) => l.author === 'sergio_buarque').map(
      (lens) => ({
        value: lens.id,
        label: lens.shortLabel,
        color: lens.accentColor,
      })
    ),
  },
  {
    label: 'Darcy Ribeiro',
    subtitle: 'O Povo Brasileiro',
    options: THEORETICAL_LENSES.filter((l) => l.author === 'darcy_ribeiro').map(
      (lens) => ({
        value: lens.id,
        label: lens.shortLabel,
        color: lens.accentColor,
      })
    ),
  },
];

const THREAD_OPTIONS: readonly EditorialSelectOption[] = CONTINUITY_THREADS.map(
  (thread) => ({
    value: thread.id,
    label: thread.title,
    color: thread.color,
  })
);

export function HeaderFilters({
  filters,
  layers,
  visibleEventCount,
  totalEventCount,
  isDrawerOpen,
  onChangeEra,
  onChangeDimension,
  onChangeLens,
  onInspectLens,
  onChangeThread,
  onToggleLayer,
  onResetFilters,
  onToggleDrawer,
  onGoOverview,
}: HeaderFiltersProps) {
  const filtersActive = hasActiveFilters(filters);

  return (
    <header className="relative shrink-0 border-b border-parchment-border bg-parchment-surface z-30">
      {/* Linha superior: Título editorial, contador e ações */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-parchment-border/70">
        <button
          type="button"
          onClick={onGoOverview}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
          title="Voltar ao panorama geral do Atlas"
        >
          <Compass
            className="w-5 h-5 text-terracotta shrink-0 transition-transform duration-300 group-hover:rotate-12"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold leading-none tracking-tight text-ink">
              Atlas da Formação do Brasil
            </h1>
            <p className="text-[11px] text-ink-muted mt-0.5 hidden sm:block">
              Cartografia histórica sob as lentes de Sérgio Buarque de Holanda e
              Darcy Ribeiro
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-parchment-border bg-parchment px-2.5 py-1 text-xs font-medium text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            <span>
              <strong className="font-semibold">{visibleEventCount}</strong> de{' '}
              {totalEventCount} marcos
            </span>
          </span>

          {filtersActive && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-md border border-terracotta/30 bg-terracotta/10 px-2.5 py-1 text-xs font-medium text-terracotta hover:bg-terracotta/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleDrawer}
            className="inline-flex items-center gap-1.5 rounded-md border border-parchment-border bg-parchment px-2.5 py-1 text-xs font-medium text-ink hover:bg-parchment-surface transition-colors"
            aria-label={
              isDrawerOpen
                ? 'Recolher painel editorial'
                : 'Expandir painel editorial'
            }
          >
            {isDrawerOpen ? (
              <PanelRightClose className="w-3.5 h-3.5 text-ink-muted" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-terracotta" />
            )}
            <span className="hidden md:inline">
              {isDrawerOpen ? 'Recolher painel' : 'Abrir painel'}
            </span>
          </button>
        </div>
      </div>

      {/* Linha de filtros analíticos e camadas cartográficas */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {/* Grupo esquerdo: Eras, Dimensões, Lente Teórica e Fio de Continuidade */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filtro de Eras */}
          <div
            className="inline-flex items-center rounded-md border border-parchment-border bg-parchment p-0.5"
            role="group"
            aria-label="Filtrar por Era histórica"
          >
            <button
              type="button"
              onClick={() => onChangeEra('all')}
              aria-pressed={filters.selectedEra === 'all'}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filters.selectedEra === 'all'
                  ? 'bg-ink text-parchment'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Todas
            </button>
            {ERA_ORDER.map((eraId) => {
              const era = ERAS[eraId];
              const isSelected = filters.selectedEra === eraId;
              return (
                <button
                  key={eraId}
                  type="button"
                  onClick={() =>
                    onChangeEra(isSelected ? 'all' : eraId)
                  }
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    isSelected
                      ? 'text-parchment shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  style={
                    isSelected ? { backgroundColor: era.color } : undefined
                  }
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: isSelected ? '#F7F3E9' : era.color,
                    }}
                    aria-hidden="true"
                  />
                  <span>{era.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Filtro de Dimensões */}
          <div
            className="inline-flex items-center rounded-md border border-parchment-border bg-parchment p-0.5"
            role="group"
            aria-label="Filtrar por Dimensão analítica"
          >
            {DIMENSION_ORDER.map((dimId) => {
              const dim = DIMENSIONS[dimId];
              const isSelected = filters.selectedDimension === dimId;
              const shortLabel = dim.label.split(' ')[0];
              return (
                <button
                  key={dimId}
                  type="button"
                  onClick={() =>
                    onChangeDimension(isSelected ? 'all' : dimId)
                  }
                  aria-pressed={isSelected}
                  title={dim.label}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-ink text-parchment'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>

          {/* Seletor de Lente Teórica */}
          <div className="inline-flex items-center gap-1">
            <EditorialSelect
              value={filters.selectedLens}
              onChange={(val) =>
                onChangeLens(val as TheoreticalLensId | 'all')
              }
              prefixLabel="Lente"
              allOptionLabel="Todas"
              allValue="all"
              groups={LENS_GROUPS}
              icon={<BookOpen className="w-3.5 h-3.5" />}
              ariaLabel="Filtrar por Lente Teórica"
              maxWidthClassName="max-w-[210px]"
              menuWidthClassName="w-64"
            />

            {filters.selectedLens !== 'all' && (
              <button
                type="button"
                onClick={() =>
                  onInspectLens(filters.selectedLens as TheoreticalLensId)
                }
                className="inline-flex items-center gap-1 rounded-md border border-parchment-border bg-parchment px-2 py-1 text-xs font-medium text-terracotta hover:bg-terracotta/10 transition-colors"
                title="Abrir ficha conceitual desta lente no painel"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Ficha</span>
              </button>
            )}
          </div>

          {/* Seletor rápido de Fio de Continuidade */}
          <EditorialSelect
            value={filters.selectedThreadId ?? ''}
            onChange={(val) => onChangeThread(val === '' ? null : val)}
            prefixLabel="Fio"
            allOptionLabel="Todos"
            allValue=""
            options={THREAD_OPTIONS}
            icon={<GitBranch className="w-3.5 h-3.5" />}
            ariaLabel="Filtrar por Fio de Continuidade"
            maxWidthClassName="max-w-[230px]"
            menuWidthClassName="w-72"
          />
        </div>

        {/* Grupo direito: Camadas Cartográficas */}
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Camadas cartográficas"
        >
          <LayerPill
            active={layers.showDarcyBrasis}
            onClick={() => onToggleLayer('showDarcyBrasis')}
            icon={<MapIcon className="w-3.5 h-3.5" />}
            label="5 Brasis"
          />
          <LayerPill
            active={layers.showIndigenousMatrices}
            onClick={() => onToggleLayer('showIndigenousMatrices')}
            icon={<Trees className="w-3.5 h-3.5" />}
            label="Indígenas"
          />
          <LayerPill
            active={layers.showRivers}
            onClick={() => onToggleLayer('showRivers')}
            icon={<Waves className="w-3.5 h-3.5" />}
            label="Rios"
          />
          <LayerPill
            active={layers.showContinuityArcs}
            onClick={() => onToggleLayer('showContinuityArcs')}
            icon={<GitBranch className="w-3.5 h-3.5" />}
            label="Fios"
          />
          <LayerPill
            active={layers.showGraticule}
            onClick={() => onToggleLayer('showGraticule')}
            icon={<Grid3X3 className="w-3.5 h-3.5" />}
            label="Retícula"
          />
        </div>
      </div>
    </header>
  );
}

interface LayerPillProps {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly icon: React.ReactNode;
  readonly label: string;
}

function LayerPill({ active, onClick, icon, label }: LayerPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-terracotta/45 bg-terracotta/14 text-ink'
          : 'border-parchment-border bg-parchment text-ink-muted hover:text-ink hover:bg-parchment-surface'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default HeaderFilters;
