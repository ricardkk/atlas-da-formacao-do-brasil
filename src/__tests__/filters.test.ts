import { describe, expect, it } from 'vitest';
import { CONTINUITY_THREADS, HISTORICAL_EVENTS } from '../data';
import {
  DEFAULT_FILTERS,
  filterHistoricalEvents,
  getDarcyBrasilById,
  getEventById,
  getEventsForLens,
  getIndigenousMatrixById,
  getLensById,
  getThreadById,
  getThreadsForEvent,
  hasActiveFilters,
} from '../utils/filters';

describe('Utilitários de filtragem e consulta do Atlas', () => {
  it('retorna os 22 eventos em ordem cronológica crescente quando nenhum filtro está ativo', () => {
    const result = filterHistoricalEvents(HISTORICAL_EVENTS, DEFAULT_FILTERS);
    expect(result).toHaveLength(22);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].year).toBeGreaterThanOrEqual(result[i - 1].year);
    }
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
  });

  it('filtra corretamente por cada Era histórica (Colônia, Império, República)', () => {
    const colonia = filterHistoricalEvents(HISTORICAL_EVENTS, {
      ...DEFAULT_FILTERS,
      selectedEra: 'colonia',
    });
    const imperio = filterHistoricalEvents(HISTORICAL_EVENTS, {
      ...DEFAULT_FILTERS,
      selectedEra: 'imperio',
    });
    const republica = filterHistoricalEvents(HISTORICAL_EVENTS, {
      ...DEFAULT_FILTERS,
      selectedEra: 'republica',
    });

    expect(colonia).toHaveLength(7);
    expect(colonia.every((e) => e.era === 'colonia')).toBe(true);
    expect(imperio).toHaveLength(8);
    expect(imperio.every((e) => e.era === 'imperio')).toBe(true);
    expect(republica).toHaveLength(7);
    expect(republica.every((e) => e.era === 'republica')).toBe(true);
  });

  it('filtra corretamente por Dimensão analítica', () => {
    const economia = filterHistoricalEvents(HISTORICAL_EVENTS, {
      ...DEFAULT_FILTERS,
      selectedDimension: 'economia',
    });
    expect(economia.length).toBeGreaterThan(0);
    expect(economia.every((e) => e.dimensions.includes('economia'))).toBe(true);
  });

  it('filtra corretamente por Lente Teórica de Sérgio Buarque e de Darcy Ribeiro', () => {
    const patrimonialismo = filterHistoricalEvents(HISTORICAL_EVENTS, {
      ...DEFAULT_FILTERS,
      selectedLens: 'patrimonialismo',
    });
    expect(patrimonialismo.length).toBeGreaterThan(0);
    expect(
      patrimonialismo.every((e) =>
        e.theoreticalReadings.some((r) => r.lensId === 'patrimonialismo')
      )
    ).toBe(true);

    const povosNovos = filterHistoricalEvents(HISTORICAL_EVENTS, {
      ...DEFAULT_FILTERS,
      selectedLens: 'povos_novos',
    });
    expect(povosNovos.length).toBeGreaterThan(0);
    expect(
      povosNovos.every((e) =>
        e.theoreticalReadings.some((r) => r.lensId === 'povos_novos')
      )
    ).toBe(true);
  });

  it('filtra corretamente por Fio de Continuidade', () => {
    const thread = CONTINUITY_THREADS[0];
    const filtered = filterHistoricalEvents(HISTORICAL_EVENTS, {
      ...DEFAULT_FILTERS,
      selectedThreadId: thread.id,
    });

    expect(filtered).toHaveLength(thread.eventIds.length);
    for (const ev of filtered) {
      expect(thread.eventIds).toContain(ev.id);
    }
  });

  it('aplica filtros combinados (Era + Dimensão + Lente) e detecta hasActiveFilters', () => {
    const combinedFilters = {
      ...DEFAULT_FILTERS,
      selectedEra: 'colonia' as const,
      selectedDimension: 'politica' as const,
      selectedLens: 'patrimonialismo' as const,
    };

    expect(hasActiveFilters(combinedFilters)).toBe(true);

    const result = filterHistoricalEvents(HISTORICAL_EVENTS, combinedFilters);
    expect(result.length).toBeGreaterThan(0);
    for (const ev of result) {
      expect(ev.era).toBe('colonia');
      expect(ev.dimensions).toContain('politica');
      expect(
        ev.theoreticalReadings.some((r) => r.lensId === 'patrimonialismo')
      ).toBe(true);
    }
  });

  it('executa corretamente os helpers de lookup', () => {
    const ev = getEventById('colonia-matriz-tupi-1500');
    expect(ev?.year).toBe(1500);
    expect(getEventById('inexistente')).toBeUndefined();

    const lens = getLensById('homem_cordial');
    expect(lens?.author).toBe('sergio_buarque');

    const brasil = getDarcyBrasilById('crioulo');
    expect(brasil?.states).toContain('BA');

    const matrix = getIndigenousMatrixById('tupi');
    expect(matrix?.pattern).toBe('waves');

    const thread = getThreadById('patrimonialismo-estado');
    expect(thread?.eventIds.length).toBeGreaterThanOrEqual(2);

    const threadsForConstituicao = getThreadsForEvent(
      'republica-constituicao-1988'
    );
    expect(threadsForConstituicao.length).toBeGreaterThanOrEqual(1);

    const eventsForCunhadismo = getEventsForLens('cunhadismo');
    expect(eventsForCunhadismo.length).toBeGreaterThan(0);
  });
});
