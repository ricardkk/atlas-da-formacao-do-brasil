import {
  CONTINUITY_THREADS,
  DARCY_BRASIS,
  HISTORICAL_EVENTS,
  INDIGENOUS_MATRICES,
  THEORETICAL_LENSES,
} from '../data';
import type {
  AtlasFilterState,
  ContinuityThread,
  DarcyBrasil,
  DarcyBrasilId,
  HistoricalEvent,
  IndigenousMatrix,
  IndigenousTrunkId,
  TheoreticalLens,
  TheoreticalLensId,
} from '../types';

/** Estado padrão (sem filtros restritivos) do Atlas da Formação do Brasil. */
export const DEFAULT_FILTERS: AtlasFilterState = {
  selectedEra: 'all',
  selectedDimension: 'all',
  selectedLens: 'all',
  selectedThreadId: null,
  selectedBrasilId: null,
  yearCutoff: 2025,
  searchQuery: '',
};

/**
 * Filtra os marcos históricos conforme o estado ativo de filtros e retorna
 * o resultado ordenado cronologicamente por `year`.
 */
export function filterHistoricalEvents(
  events: readonly HistoricalEvent[],
  filters: AtlasFilterState
): HistoricalEvent[] {
  const threadEventIds = filters.selectedThreadId
    ? new Set(
        getThreadById(filters.selectedThreadId)?.eventIds ?? []
      )
    : null;

  const normalizedQuery = filters.searchQuery.trim().toLowerCase();

  return events
    .filter((event) => {
      if (filters.selectedEra !== 'all' && event.era !== filters.selectedEra) {
        return false;
      }

      if (
        filters.selectedDimension !== 'all' &&
        !event.dimensions.includes(filters.selectedDimension)
      ) {
        return false;
      }

      if (
        filters.selectedLens !== 'all' &&
        !event.theoreticalReadings.some(
          (reading) => reading.lensId === filters.selectedLens
        )
      ) {
        return false;
      }

      if (threadEventIds && !threadEventIds.has(event.id)) {
        return false;
      }

      if (
        filters.selectedBrasilId !== null &&
        event.darcyBrasilId !== filters.selectedBrasilId
      ) {
        return false;
      }

      if (event.year > filters.yearCutoff) {
        return false;
      }

      if (normalizedQuery.length > 0) {
        const searchable = [
          event.title,
          event.shortTitle,
          event.locationName,
          event.summary,
          event.yearLabel,
        ]
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(normalizedQuery)) {
          return false;
        }
      }

      return true;
    })
    .slice()
    .sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
}

/** Verifica se existe qualquer filtro ativo além do estado padrão. */
export function hasActiveFilters(filters: AtlasFilterState): boolean {
  return (
    filters.selectedEra !== 'all' ||
    filters.selectedDimension !== 'all' ||
    filters.selectedLens !== 'all' ||
    filters.selectedThreadId !== null ||
    filters.selectedBrasilId !== null ||
    filters.yearCutoff < 2025 ||
    filters.searchQuery.trim().length > 0
  );
}

/** Busca um marco histórico pelo ID. */
export function getEventById(
  eventId: string,
  events: readonly HistoricalEvent[] = HISTORICAL_EVENTS
): HistoricalEvent | undefined {
  return events.find((ev) => ev.id === eventId);
}

/** Busca uma lente teórica pelo ID. */
export function getLensById(
  lensId: TheoreticalLensId
): TheoreticalLens | undefined {
  return THEORETICAL_LENSES.find((lens) => lens.id === lensId);
}

/** Busca um dos 5 Brasis de Darcy Ribeiro pelo ID. */
export function getDarcyBrasilById(
  brasilId: DarcyBrasilId
): DarcyBrasil | undefined {
  return DARCY_BRASIS.find((b) => b.id === brasilId);
}

/** Busca uma matriz indígena pelo ID do tronco/família. */
export function getIndigenousMatrixById(
  trunkId: IndigenousTrunkId
): IndigenousMatrix | undefined {
  return INDIGENOUS_MATRICES.find((m) => m.id === trunkId);
}

/** Busca um Fio de Continuidade pelo ID. */
export function getThreadById(
  threadId: string
): ContinuityThread | undefined {
  return CONTINUITY_THREADS.find((t) => t.id === threadId);
}

/** Retorna todos os Fios de Continuidade aos quais um marco histórico pertence. */
export function getThreadsForEvent(eventId: string): ContinuityThread[] {
  return CONTINUITY_THREADS.filter((thread) =>
    thread.eventIds.includes(eventId)
  );
}

/** Retorna todos os marcos históricos analisados por uma lente teórica específica. */
export function getEventsForLens(
  lensId: TheoreticalLensId,
  events: readonly HistoricalEvent[] = HISTORICAL_EVENTS
): HistoricalEvent[] {
  return events
    .filter((ev) =>
      ev.theoreticalReadings.some((reading) => reading.lensId === lensId)
    )
    .slice()
    .sort((a, b) => a.year - b.year);
}
