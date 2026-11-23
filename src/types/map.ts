/**
 * Contratos cartográficos, de filtros e de estado de interface do Atlas da Formação do Brasil.
 */

import type {
  DarcyBrasilId,
  DimensionId,
  EraId,
  IndigenousTrunkId,
  MapSymbolId,
  TerritorialSnapshotId,
  TheoreticalLensId,
} from './history';

/** Metadados da legenda para cada símbolo cartográfico exibido no mapa. */
export interface MapSymbolMetadata {
  readonly id: MapSymbolId;
  readonly label: string;
  readonly description: string;
  readonly category: DimensionId;
}

/** Metadados de um recorte histórico de sobreposição territorial no mapa. */
export interface TerritorialSnapshot {
  readonly id: TerritorialSnapshotId;
  readonly year: number;
  readonly label: string;
  readonly shortLabel: string;
  readonly era: EraId;
  readonly description: string;
  readonly treatyOrMilestone: string;
  readonly color: string;
}

/** Estado de visibilidade das camadas cartográficas do mapa vetorial. */
export interface MapLayerState {
  readonly showEvents: boolean;
  readonly showDarcyBrasis: boolean;
  readonly showIndigenousMatrices: boolean;
  readonly showRivers: boolean;
  readonly showGraticule: boolean;
  readonly showContinuityArcs: boolean;
  readonly showTerritorialOverlay: boolean;
  readonly activeTerritorialSnapshot: TerritorialSnapshotId;
}

/** Estado combinado dos filtros temporais, temáticos e conceituais do Atlas. */
export interface AtlasFilterState {
  readonly selectedEra: EraId | 'all';
  readonly selectedDimension: DimensionId | 'all';
  readonly selectedLens: TheoreticalLensId | 'all';
  readonly selectedThreadId: string | null;
  readonly selectedBrasilId: DarcyBrasilId | null;
  readonly yearCutoff: number;
  readonly searchQuery: string;
}

/** Seleção ativa que controla o conteúdo exibido no painel editorial lateral. */
export type AtlasSelection =
  | { readonly kind: 'overview' }
  | { readonly kind: 'event'; readonly eventId: string }
  | { readonly kind: 'thread'; readonly threadId: string }
  | { readonly kind: 'brasil'; readonly brasilId: DarcyBrasilId }
  | { readonly kind: 'indigenous'; readonly trunkId: IndigenousTrunkId }
  | { readonly kind: 'lens'; readonly lensId: TheoreticalLensId };

/** Parâmetros de dimensões e transformação (zoom/pan) do viewport SVG do mapa. */
export interface MapViewport {
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  readonly translateX: number;
  readonly translateY: number;
}
