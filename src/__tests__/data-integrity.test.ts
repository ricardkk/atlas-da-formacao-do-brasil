import { describe, expect, it } from 'vitest';
import brazilStatesTopology from '../data/geo/brazil-states.json';
import {
  CARTOGRAPHIC_NOTES,
  IMPERIAL_PROVINCE_GROUPS_1850,
} from '../data/geo/historical-layers';
import {
  CONTINUITY_THREADS,
  DARCY_BRASIS,
  HISTORICAL_EVENTS,
  INDIGENOUS_MATRICES,
  MAP_SYMBOLS,
  TERRITORIAL_SNAPSHOTS,
  THEORETICAL_LENSES,
} from '../data';
import type { LngLat, StateCode } from '../types';

const ALL_27_UFS: readonly StateCode[] = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];

function expectValidBrazilCoords([lon, lat]: LngLat, label: string) {
  expect(lon, `${label}: lon fora dos limites do Brasil`).toBeGreaterThanOrEqual(-74);
  expect(lon, `${label}: lon fora dos limites do Brasil`).toBeLessThanOrEqual(-34);
  expect(lat, `${label}: lat fora dos limites do Brasil`).toBeGreaterThanOrEqual(-34);
  expect(lat, `${label}: lat fora dos limites do Brasil`).toBeLessThanOrEqual(5.5);
}

describe('Integridade dos dados históricos e cartográficos', () => {
  it('contém exatamente 22 marcos históricos (7 Colônia, 8 Império, 7 República) com IDs únicos', () => {
    expect(HISTORICAL_EVENTS).toHaveLength(22);

    const ids = new Set(HISTORICAL_EVENTS.map((e) => e.id));
    expect(ids.size).toBe(22);

    const byEra = {
      colonia: HISTORICAL_EVENTS.filter((e) => e.era === 'colonia'),
      imperio: HISTORICAL_EVENTS.filter((e) => e.era === 'imperio'),
      republica: HISTORICAL_EVENTS.filter((e) => e.era === 'republica'),
    };
    expect(byEra.colonia).toHaveLength(7);
    expect(byEra.imperio).toHaveLength(8);
    expect(byEra.republica).toHaveLength(7);
  });

  it('inclui o marco de Abolição em Mossoró (1883, RN) vinculado ao fio terra-trabalho-desigualdade', () => {
    const mossoro = HISTORICAL_EVENTS.find(
      (e) => e.id === 'imperio-abolicao-mossoro-1883'
    );
    expect(mossoro).toBeDefined();
    expect(mossoro?.year).toBe(1883);
    expect(mossoro?.era).toBe('imperio');
    expect(mossoro?.stateCodes).toContain('RN');

    const thread = CONTINUITY_THREADS.find(
      (t) => t.id === 'terra-trabalho-desigualdade'
    );
    expect(thread?.eventIds).toContain('imperio-abolicao-mossoro-1883');
  });

  it('possui coordenadas [lon, lat] válidas dentro dos limites do Brasil em todos os registros georreferenciados', () => {
    for (const ev of HISTORICAL_EVENTS) {
      expectValidBrazilCoords(ev.coordinates, `Evento ${ev.id}`);
    }
    for (const brasil of DARCY_BRASIS) {
      expectValidBrazilCoords(brasil.centroid, `Brasil ${brasil.id}`);
    }
    for (const matrix of INDIGENOUS_MATRICES) {
      expectValidBrazilCoords(matrix.centroid, `Matriz ${matrix.id}`);
    }
    expect(CARTOGRAPHIC_NOTES).toHaveLength(5);
    for (const note of CARTOGRAPHIC_NOTES) {
      expectValidBrazilCoords(note.coordinates, `Nota ${note.id}`);
    }
  });

  it('particiona de forma completa e exclusiva as 27 UFs nos 5 Brasis de Darcy Ribeiro', () => {
    expect(DARCY_BRASIS).toHaveLength(5);
    const assigned = DARCY_BRASIS.flatMap((b) => [...b.states]);
    expect(assigned).toHaveLength(27);
    expect(new Set(assigned).size).toBe(27);
    expect(assigned.slice().sort()).toEqual(ALL_27_UFS.slice().sort());
  });

  it('contém exatamente as 27 UFs válidas na malha TopoJSON local (brazil-states.json)', () => {
    const geometries = brazilStatesTopology.objects.states.geometries;
    expect(geometries).toHaveLength(27);
    const siglas = geometries.map((g) => g.properties.sigla).sort();
    expect(siglas).toEqual(ALL_27_UFS.slice().sort());
  });

  it('cobre exatamente 26 UFs (todas exceto AC) em IMPERIAL_PROVINCE_GROUPS_1850, sem duplicatas', () => {
    const imperialStates = IMPERIAL_PROVINCE_GROUPS_1850.flatMap((g) => [
      ...g.states,
    ]);
    expect(imperialStates).toHaveLength(26);
    expect(new Set(imperialStates).size).toBe(26);
    expect(imperialStates).not.toContain('AC');

    const expectedWithoutAC = ALL_27_UFS.filter((uf) => uf !== 'AC').sort();
    expect(imperialStates.slice().sort()).toEqual(expectedWithoutAC);
  });

  it('mantém integridade referencial entre eventos, lentes teóricas, fios, símbolos, 5 Brasis e recortes territoriais', () => {
    const eventIds = new Set(HISTORICAL_EVENTS.map((e) => e.id));
    const lensById = new Map(THEORETICAL_LENSES.map((l) => [l.id, l]));
    const brasilIds = new Set(DARCY_BRASIS.map((b) => b.id));
    const snapshotIds = new Set(TERRITORIAL_SNAPSHOTS.map((s) => s.id));
    const symbolIds = new Set(Object.keys(MAP_SYMBOLS));

    for (const ev of HISTORICAL_EVENTS) {
      expect(symbolIds.has(ev.symbol), `Símbolo inválido em ${ev.id}`).toBe(true);

      if (ev.darcyBrasilId) {
        expect(brasilIds.has(ev.darcyBrasilId)).toBe(true);
      }
      if (ev.territorialSnapshotId) {
        expect(snapshotIds.has(ev.territorialSnapshotId)).toBe(true);
      }

      for (const relId of ev.relatedEventIds) {
        expect(eventIds.has(relId), `relatedEventId inexistente: ${relId}`).toBe(
          true
        );
      }

      for (const reading of ev.theoreticalReadings) {
        const lens = lensById.get(reading.lensId);
        expect(lens, `lensId inexistente em ${ev.id}: ${reading.lensId}`).toBeDefined();
        expect(reading.author).toBe(lens?.author);
      }
    }

    for (const thread of CONTINUITY_THREADS) {
      for (const evId of thread.eventIds) {
        expect(eventIds.has(evId), `eventId inexistente no fio ${thread.id}`).toBe(
          true
        );
      }
      for (const lensId of thread.lenses) {
        expect(lensById.has(lensId)).toBe(true);
      }
    }

    for (const brasil of DARCY_BRASIS) {
      for (const evId of brasil.relatedEventIds) {
        expect(eventIds.has(evId)).toBe(true);
      }
    }
  });
});
