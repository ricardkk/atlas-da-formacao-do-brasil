import type {
  IndigenousTrunkId,
  LngLat,
  StateCode,
  TerritorialSnapshotId,
} from '../../types';

/** Curso fluvial estruturante da formação territorial brasileira. */
export interface RiverFeature {
  readonly id: string;
  readonly name: string;
  readonly coordinates: readonly LngLat[];
  readonly labelPosition: LngLat;
  readonly labelRotation?: number;
  readonly strokeWidth: number;
}

/** Principais rios estruturantes da ocupação e integração do território brasileiro. */
export const MAJOR_RIVERS: readonly RiverFeature[] = [
  {
    id: 'amazonas',
    name: 'Rio Amazonas',
    strokeWidth: 2.2,
    labelPosition: [-58.8, -2.2],
    labelRotation: -8,
    coordinates: [
      [-69.94, -4.23],
      [-67.9, -3.55],
      [-65.8, -2.95],
      [-64.71, -3.35],
      [-62.4, -3.72],
      [-60.02, -3.13],
      [-58.45, -3.05],
      [-56.74, -2.63],
      [-54.71, -2.44],
      [-52.58, -1.53],
      [-50.95, -0.85],
      [-49.45, -0.25],
    ],
  },
  {
    id: 'sao-francisco',
    name: 'Rio São Francisco',
    strokeWidth: 1.75,
    labelPosition: [-42.2, -12.6],
    labelRotation: -55,
    coordinates: [
      [-46.45, -20.24],
      [-45.65, -18.95],
      [-44.94, -17.34],
      [-44.36, -15.48],
      [-43.42, -13.25],
      [-43.14, -11.09],
      [-42.15, -9.95],
      [-40.5, -9.4],
      [-39.15, -8.85],
      [-38.22, -9.4],
      [-37.1, -9.95],
      [-36.39, -10.5],
    ],
  },
  {
    id: 'tocantins',
    name: 'Rio Tocantins',
    strokeWidth: 1.55,
    labelPosition: [-47.4, -7.8],
    labelRotation: -75,
    coordinates: [
      [-48.95, -14.5],
      [-48.35, -12.5],
      [-48.38, -10.25],
      [-47.95, -7.85],
      [-47.49, -5.52],
      [-48.72, -5.38],
      [-49.13, -5.37],
      [-49.67, -3.77],
      [-49.3, -2.25],
      [-48.95, -1.5],
    ],
  },
  {
    id: 'araguaia',
    name: 'Rio Araguaia',
    strokeWidth: 1.35,
    labelPosition: [-51.5, -11.4],
    labelRotation: -80,
    coordinates: [
      [-52.95, -17.4],
      [-52.25, -15.89],
      [-51.1, -13.9],
      [-50.65, -11.5],
      [-49.9, -9.8],
      [-49.26, -8.26],
      [-48.72, -5.38],
    ],
  },
  {
    id: 'parana',
    name: 'Rio Paraná',
    strokeWidth: 1.65,
    labelPosition: [-53.9, -22.2],
    labelRotation: -55,
    coordinates: [
      [-50.95, -19.85],
      [-51.65, -20.78],
      [-52.18, -21.75],
      [-53.27, -22.76],
      [-54.25, -24.08],
      [-54.58, -25.55],
    ],
  },
  {
    id: 'tiete',
    name: 'Rio Tietê',
    strokeWidth: 1.25,
    labelPosition: [-48.9, -22.9],
    labelRotation: 20,
    coordinates: [
      [-45.85, -23.58],
      [-46.63, -23.52],
      [-47.65, -23.15],
      [-48.56, -22.5],
      [-49.55, -21.85],
      [-50.45, -21.15],
      [-51.6, -20.66],
    ],
  },
];

/** Faixa horizontal aproximada de uma Capitania Hereditária (1534). */
export interface CapitaniaBand {
  readonly id: string;
  readonly name: string;
  readonly northLat: number;
  readonly southLat: number;
  readonly labelPosition?: LngLat;
}

/** Rótulo geográfico auxiliar de um recorte territorial histórico. */
export interface TerritorialLabel {
  readonly text: string;
  readonly subtext?: string;
  readonly position: LngLat;
  readonly rotation?: number;
}

/** Dados geométricos de cada um dos 5 recortes territoriais históricos. */
export interface TerritorialOverlayData {
  readonly id: TerritorialSnapshotId;
  readonly meridianLine?: readonly LngLat[];
  readonly secondaryLine?: readonly LngLat[];
  readonly borderLine?: readonly LngLat[];
  readonly highlightArea?: readonly LngLat[];
  readonly spanishArea?: readonly LngLat[];
  readonly capitanias?: readonly CapitaniaBand[];
  readonly capitalMarker?: {
    readonly name: string;
    readonly subtitle: string;
    readonly position: LngLat;
  };
  readonly labels: readonly TerritorialLabel[];
}

const TORDESILHAS_LON = -48.7;

const TORDESILHAS_MERIDIAN: readonly LngLat[] = [
  [TORDESILHAS_LON, 5.8],
  [TORDESILHAS_LON, -5.0],
  [TORDESILHAS_LON, -15.0],
  [TORDESILHAS_LON, -25.0],
  [TORDESILHAS_LON, -34.5],
];

/** Recortes territoriais históricos para sobreposição na malha do Brasil. */
export const TERRITORIAL_OVERLAYS: Record<
  TerritorialSnapshotId,
  TerritorialOverlayData
> = {
  tordesilhas_1500: {
    id: 'tordesilhas_1500',
    meridianLine: TORDESILHAS_MERIDIAN,
    highlightArea: [
      [TORDESILHAS_LON, 6.0],
      [-33.0, 6.0],
      [-33.0, -35.0],
      [TORDESILHAS_LON, -35.0],
      [TORDESILHAS_LON, 6.0],
    ],
    spanishArea: [
      [-75.0, 6.0],
      [TORDESILHAS_LON, 6.0],
      [TORDESILHAS_LON, -35.0],
      [-75.0, -35.0],
      [-75.0, 6.0],
    ],
    labels: [
      {
        text: 'Meridiano de Tordesilhas',
        subtext: '1494 · ~48°42′W',
        position: [-47.9, -18.5],
        rotation: -90,
      },
      {
        text: 'Domínio Português',
        subtext: 'América Portuguesa',
        position: [-41.8, -11.5],
      },
      {
        text: 'Terras de Castela',
        subtext: 'Além-Tordesilhas',
        position: [-61.0, -8.5],
      },
    ],
  },
  capitanias_1534: {
    id: 'capitanias_1534',
    meridianLine: TORDESILHAS_MERIDIAN,
    spanishArea: [
      [-75.0, 6.0],
      [TORDESILHAS_LON, 6.0],
      [TORDESILHAS_LON, -35.0],
      [-75.0, -35.0],
      [-75.0, 6.0],
    ],
    capitanias: [
      {
        id: 'maranhao',
        name: 'Maranhão',
        northLat: -1.2,
        southLat: -3.6,
        labelPosition: [-44.8, -2.7],
      },
      {
        id: 'ceara',
        name: 'Ceará',
        northLat: -3.6,
        southLat: -5.2,
      },
      {
        id: 'rio-grande',
        name: 'Rio Grande',
        northLat: -5.2,
        southLat: -6.8,
      },
      {
        id: 'itamaraca',
        name: 'Itamaracá',
        northLat: -6.8,
        southLat: -7.9,
      },
      {
        id: 'pernambuco',
        name: 'Pernambuco',
        northLat: -7.9,
        southLat: -10.5,
        labelPosition: [-41.5, -9.1],
      },
      {
        id: 'bahia',
        name: 'Bahia',
        northLat: -10.5,
        southLat: -13.9,
        labelPosition: [-42.2, -12.3],
      },
      {
        id: 'ilheus',
        name: 'Ilhéus',
        northLat: -13.9,
        southLat: -16.1,
      },
      {
        id: 'porto-seguro',
        name: 'Porto Seguro',
        northLat: -16.1,
        southLat: -18.7,
        labelPosition: [-42.6, -17.4],
      },
      {
        id: 'espirito-santo',
        name: 'Espírito Santo',
        northLat: -18.7,
        southLat: -21.2,
      },
      {
        id: 'sao-tome',
        name: 'São Tomé',
        northLat: -21.2,
        southLat: -22.8,
      },
      {
        id: 'sao-vicente',
        name: 'São Vicente',
        northLat: -22.8,
        southLat: -25.4,
        labelPosition: [-45.8, -23.9],
      },
      {
        id: 'santana',
        name: 'Santana',
        northLat: -25.4,
        southLat: -28.4,
      },
    ],
    labels: [
      {
        text: 'Capitanias Hereditárias (1534)',
        subtext: 'Faixas da costa até Tordesilhas',
        position: [-41.5, -5.8],
      },
    ],
  },
  madri_1750: {
    id: 'madri_1750',
    secondaryLine: TORDESILHAS_MERIDIAN,
    borderLine: [
      [-51.8, 4.2],
      [-56.0, 2.2],
      [-60.2, 4.4],
      [-64.5, 3.8],
      [-67.2, 1.5],
      [-69.8, -1.2],
      [-70.0, -4.3],
      [-67.8, -7.2],
      [-65.4, -9.8],
      [-62.8, -12.5],
      [-60.2, -14.8],
      [-58.4, -17.4],
      [-57.8, -20.5],
      [-55.8, -23.0],
      [-54.6, -25.6],
      [-55.6, -28.0],
      [-57.4, -30.2],
      [-54.8, -31.8],
      [-53.3, -33.6],
    ],
    labels: [
      {
        text: 'Tratado de Madri (1750)',
        subtext: 'Expansão pelo uti possidetis',
        position: [-60.5, -10.5],
      },
      {
        text: 'Antiga linha de Tordesilhas',
        position: [-47.9, -15.5],
        rotation: -90,
      },
    ],
  },
  imperio_1850: {
    id: 'imperio_1850',
    capitalMarker: {
      name: 'Corte Imperial',
      subtitle: 'Rio de Janeiro',
      position: [-43.17, -22.91],
    },
    labels: [
      {
        text: 'Império do Brasil (1850)',
        subtext: 'Províncias sob Estado Unitário',
        position: [-53.5, -14.2],
      },
    ],
  },
  republica_1889: {
    id: 'republica_1889',
    capitalMarker: {
      name: 'Brasília (1960)',
      subtitle: 'Distrito Federal',
      position: [-47.88, -15.79],
    },
    labels: [
      {
        text: 'República Federativa',
        subtext: '27 Unidades da Federação',
        position: [-53.5, -14.2],
      },
    ],
  },
};

/** Região geográfica aproximada de cada matriz linguístico-cultural indígena. */
export interface IndigenousRegionGeometry {
  readonly id: IndigenousTrunkId;
  readonly labelPosition: LngLat;
  readonly polygons: readonly (readonly LngLat[])[];
}

/**
 * Polígonos geográficos simplificados correspondentes aos 4 troncos em `INDIGENOUS_MATRICES`.
 * No `MapCanvas`, são clipados pela silhueta oficial do Brasil e renderizados com padrões SVG
 * (`waves`, `hatch`, `dots`, `cross`) e `mix-blend-mode: multiply`.
 */
export const INDIGENOUS_REGIONS: readonly IndigenousRegionGeometry[] = [
  {
    id: 'tupi',
    labelPosition: [-39.5, -15.2],
    polygons: [
      // Faixa litorânea atlântica e bacia do Paraná-Paraguai
      [
        [-45.0, -1.5],
        [-34.5, -5.0],
        [-34.5, -10.5],
        [-38.0, -18.5],
        [-41.0, -23.5],
        [-47.0, -28.0],
        [-52.0, -32.5],
        [-56.5, -28.0],
        [-55.5, -22.5],
        [-51.0, -20.5],
        [-46.5, -21.0],
        [-42.5, -17.5],
        [-41.5, -11.5],
        [-40.5, -6.5],
        [-45.0, -1.5],
      ],
      // Núcleo Tupi na Amazônia centro-oriental (Tapajós / Xingu / Maranhão)
      [
        [-58.5, -2.5],
        [-49.5, -2.5],
        [-45.5, -5.5],
        [-47.5, -9.0],
        [-55.5, -9.5],
        [-59.5, -6.0],
        [-58.5, -2.5],
      ],
    ],
  },
  {
    id: 'macro_je',
    labelPosition: [-49.0, -12.8],
    polygons: [
      // Planalto Central, Cerrado, Caatinga interior e Planalto Meridional
      [
        [-55.0, -7.5],
        [-46.0, -6.5],
        [-41.5, -8.5],
        [-41.5, -15.5],
        [-43.5, -20.5],
        [-48.5, -24.5],
        [-52.5, -28.0],
        [-54.5, -25.0],
        [-52.0, -19.5],
        [-55.5, -15.5],
        [-56.5, -10.5],
        [-55.0, -7.5],
      ],
    ],
  },
  {
    id: 'arawak',
    labelPosition: [-64.5, -4.8],
    polygons: [
      // Alto Rio Negro, Amazônia Ocidental e Pantanal
      [
        [-70.5, 1.5],
        [-63.0, 1.0],
        [-60.5, -4.0],
        [-62.5, -10.5],
        [-67.0, -11.5],
        [-73.5, -8.5],
        [-71.5, -2.5],
        [-70.5, 1.5],
      ],
      [
        [-58.5, -16.5],
        [-55.0, -17.5],
        [-55.5, -22.0],
        [-58.2, -21.5],
        [-58.5, -16.5],
      ],
    ],
  },
  {
    id: 'karib',
    labelPosition: [-57.5, 0.8],
    polygons: [
      // Escudo das Guianas e Norte Amazônico
      [
        [-64.0, 4.8],
        [-59.5, 4.8],
        [-52.5, 3.8],
        [-50.0, 0.5],
        [-53.5, -2.0],
        [-59.5, -1.5],
        [-63.5, 1.0],
        [-64.0, 4.8],
      ],
      // Alto Xingu
      [
        [-55.2, -10.5],
        [-52.0, -10.5],
        [-52.0, -13.8],
        [-55.2, -13.8],
        [-55.2, -10.5],
      ],
    ],
  },
];

/** Agrupamento de UFs atuais para fusão topológica das Províncias do Império em 1850 (sem o Acre). */
export interface ImperialProvinceGroup {
  readonly id: string;
  readonly name: string;
  readonly states: readonly StateCode[];
}

/**
 * 19 Províncias históricas do Império do Brasil em 1850 (excluindo o Acre, incorporado em 1903).
 * Usa fusão topológica (`topojson.merge`) para eliminar divisas criadas após 1850:
 * Paraná (1853), Rondônia/Roraima/Amapá (1943), Distrito Federal (1960), Mato Grosso do Sul (1977)
 * e Tocantins (1988).
 */
export const IMPERIAL_PROVINCE_GROUPS_1850: readonly ImperialProvinceGroup[] = [
  { id: 'amazonas', name: 'Província do Amazonas (1850)', states: ['AM', 'RR'] },
  { id: 'grao-para', name: 'Província do Grão-Pará', states: ['PA', 'AP'] },
  { id: 'mato-grosso', name: 'Província de Mato Grosso', states: ['MT', 'MS', 'RO'] },
  { id: 'goias', name: 'Província de Goiás', states: ['GO', 'TO', 'DF'] },
  { id: 'sao-paulo', name: 'Província de São Paulo (inclui 5ª Comarca)', states: ['SP', 'PR'] },
  { id: 'maranhao', name: 'Província do Maranhão', states: ['MA'] },
  { id: 'piaui', name: 'Província do Piauí', states: ['PI'] },
  { id: 'ceara', name: 'Província do Ceará', states: ['CE'] },
  { id: 'rio-grande-do-norte', name: 'Província do Rio Grande do Norte', states: ['RN'] },
  { id: 'paraiba', name: 'Província da Paraíba', states: ['PB'] },
  { id: 'pernambuco', name: 'Província de Pernambuco', states: ['PE'] },
  { id: 'alagoas', name: 'Província de Alagoas', states: ['AL'] },
  { id: 'sergipe', name: 'Província de Sergipe', states: ['SE'] },
  { id: 'bahia', name: 'Província da Bahia', states: ['BA'] },
  { id: 'minas-gerais', name: 'Província de Minas Gerais', states: ['MG'] },
  { id: 'espirito-santo', name: 'Província do Espírito Santo', states: ['ES'] },
  { id: 'rio-de-janeiro', name: 'Província do Rio de Janeiro & Corte', states: ['RJ'] },
  { id: 'santa-catarina', name: 'Província de Santa Catarina', states: ['SC'] },
  { id: 'sao-pedro-rs', name: 'Província de São Pedro do Rio Grande do Sul', states: ['RS'] },
];

/** Anotação cartográfica contextual exibida como marcador "?" sobre o mapa. */
export interface CartographicNote {
  readonly id: string;
  readonly snapshots: readonly TerritorialSnapshotId[];
  readonly coordinates: LngLat;
  readonly badgeLabel: string;
  readonly title: string;
  readonly explanation: string;
}

/** Notas cartográficas contextuais para esclarecer limites e anacronismos em cada recorte. */
export const CARTOGRAPHIC_NOTES: readonly CartographicNote[] = [
  {
    id: 'note-tordesilhas-referencia',
    snapshots: ['tordesilhas_1500', 'capitanias_1534'],
    coordinates: [-48.7, -14.0],
    badgeLabel: 'Nota Cartográfica · 1494/1534',
    title: 'Meridiano de Tordesilhas e Contorno de Referência',
    explanation:
      'A linha de 1494 dividia o Novo Mundo entre Portugal e Castela, limitando a posse formal portuguesa à faixa oriental. O contorno atual do Brasil (sem o Acre) aparece ao fundo de forma suave apenas como referência geográfica para situar o leitor.',
  },
  {
    id: 'note-madri-uti-possidetis',
    snapshots: ['madri_1750'],
    coordinates: [-60.5, -6.5],
    badgeLabel: 'Tratado de Madri · 1750',
    title: 'Fronteira do Uti Possidetis',
    explanation:
      'O Tratado de Madri substituiu a linha de Tordesilhas pelo princípio da posse efetiva (uti possidetis), reconhecendo a expansão bandeirante, missionária e amazônica que desenhou quase todo o contorno continental atual — ainda sem o Acre.',
  },
  {
    id: 'note-acre-petropolis',
    snapshots: ['madri_1750', 'imperio_1850'],
    coordinates: [-70.1, -9.2],
    badgeLabel: 'Acre · Fora do Território',
    title: 'Território do Acre (incorporado em 1903)',
    explanation:
      'Até o início do século XX, o Acre pertencia à Bolívia (e antes ao domínio espanhol). Só foi incorporado ao Brasil pelo Tratado de Petrópolis (1903), após a migração de milhares de seringueiros nordestinos durante o Ciclo da Borracha.',
  },
  {
    id: 'note-provincias-unidas-1850',
    snapshots: ['imperio_1850'],
    coordinates: [-49.8, -12.6],
    badgeLabel: 'Divisão Provincial · 1850',
    title: 'Províncias Unidas do Norte e Centro-Oeste',
    explanation:
      'Em 1850 ainda não existiam Tocantins (1988), Mato Grosso do Sul (1977), Rondônia (1943/1981), Roraima (1943/1988), Amapá (1943/1988) nem o Distrito Federal em Brasília (1960). Por isso, essas áreas aparecem fundidas às antigas províncias imperiais de Goiás, Mato Grosso, Grão-Pará e Amazonas.',
  },
  {
    id: 'note-parana-sao-paulo-1850',
    snapshots: ['imperio_1850'],
    coordinates: [-51.3, -24.5],
    badgeLabel: '5ª Comarca · 1850',
    title: 'Paraná integrado à Província de São Paulo',
    explanation:
      'Em 1850, o território do atual estado do Paraná ainda fazia parte da Província de São Paulo como sua 5ª Comarca (Comarca de Curitiba). A emancipação da Província do Paraná ocorreu apenas em 1853.',
  },
];

