/**
 * Contratos de domínio histórico-conceitual do Atlas da Formação do Brasil.
 * Este módulo é independente de camadas cartográficas/UI e não importa de `./map`.
 */

/** Coordenada geográfica em graus decimais [longitude, latitude] (padrão GeoJSON / d3-geo). */
export type LngLat = readonly [lon: number, lat: number];

/** Siglas oficiais das 27 Unidades Federativas do Brasil. */
export type StateCode =
  | 'AC'
  | 'AL'
  | 'AP'
  | 'AM'
  | 'BA'
  | 'CE'
  | 'DF'
  | 'ES'
  | 'GO'
  | 'MA'
  | 'MT'
  | 'MS'
  | 'MG'
  | 'PA'
  | 'PB'
  | 'PR'
  | 'PE'
  | 'PI'
  | 'RJ'
  | 'RN'
  | 'RS'
  | 'RO'
  | 'RR'
  | 'SC'
  | 'SP'
  | 'SE'
  | 'TO';

/** Grandes períodos estruturantes da formação histórica brasileira. */
export type EraId = 'colonia' | 'imperio' | 'republica';

/** Metadados editoriais e cromáticos de cada Era histórica. */
export interface EraMetadata {
  readonly id: EraId;
  readonly label: string;
  readonly shortLabel: string;
  readonly periodLabel: string;
  readonly startYear: number;
  readonly endYear: number;
  readonly summary: string;
  readonly color: string;
  readonly tailwindToken: 'terracotta' | 'indigo-atlas' | 'forest';
}

/** Dimensões analíticas dos marcos históricos. */
export type DimensionId = 'economia' | 'cultura' | 'politica';

/** Metadados descritivos de cada dimensão analítica. */
export interface DimensionMetadata {
  readonly id: DimensionId;
  readonly label: string;
  readonly description: string;
  readonly color: string;
}

/** Identificadores da simbologia cartográfica dos eventos no mapa. */
export type MapSymbolId =
  | 'engenho'
  | 'ouro'
  | 'bandeira'
  | 'embarcacao'
  | 'cafe'
  | 'industria'
  | 'cultura'
  | 'aldeia'
  | 'politica'
  | 'pecuaria'
  | 'urbanizacao';

/** Autores-base que estruturam as lentes teóricas do Atlas. */
export type TheoreticalAuthor = 'sergio_buarque' | 'darcy_ribeiro';

/** Conceitos estruturantes de *Raízes do Brasil* (Sérgio Buarque de Holanda). */
export type BuarqueLensId =
  | 'aventureiro_trabalhador'
  | 'semeador_ladrilhador'
  | 'homem_cordial'
  | 'patrimonialismo'
  | 'plasticidade_iberica';

/** Conceitos estruturantes de *O Povo Brasileiro* (Darcy Ribeiro). */
export type DarcyLensId =
  | 'povos_novos'
  | 'cunhadismo'
  | 'moinho_de_gastar_gente'
  | 'ninguendade'
  | 'cinco_brasis'
  | 'atualizacao_historica';

/** União de todas as lentes teóricas disponíveis no Atlas. */
export type TheoreticalLensId = BuarqueLensId | DarcyLensId;

/** Definição enciclopédica de uma lente teórica. */
export interface TheoreticalLens {
  readonly id: TheoreticalLensId;
  readonly author: TheoreticalAuthor;
  readonly authorName: string;
  readonly workTitle: string;
  readonly workYear: number;
  readonly title: string;
  readonly shortLabel: string;
  readonly definition: string;
  readonly contemporaryRelevance: string;
  readonly accentColor: string;
}

/** Aplicação analítica de uma lente teórica a um marco histórico específico. */
export interface TheoreticalReading {
  readonly lensId: TheoreticalLensId;
  readonly author: TheoreticalAuthor;
  readonly conceptLabel: string;
  readonly analysis: string;
}

/** As cinco grandes áreas culturais brasileiras segundo Darcy Ribeiro. */
export type DarcyBrasilId =
  | 'crioulo'
  | 'caboclo'
  | 'sertanejo'
  | 'caipira'
  | 'sulino';

/** Caracterização histórico-cultural de cada um dos 5 Brasis de Darcy Ribeiro. */
export interface DarcyBrasil {
  readonly id: DarcyBrasilId;
  readonly name: string;
  readonly subtitle: string;
  readonly states: readonly StateCode[];
  readonly centroid: LngLat;
  readonly color: string;
  readonly economicBase: string;
  readonly culturalMatrix: string;
  readonly summary: string;
  readonly presentDayEcho: string;
  readonly relatedEventIds: readonly string[];
}

/** Grandes troncos e famílias linguístico-culturais indígenas no território brasileiro. */
export type IndigenousTrunkId = 'tupi' | 'macro_je' | 'arawak' | 'karib';

/** Padrões de hachura SVG utilizados para sobreposições cartográficas sutis. */
export type CartographicPattern = 'dots' | 'hatch' | 'cross' | 'waves';

/** Camada das matrizes indígenas originárias e sua permanência contemporânea. */
export interface IndigenousMatrix {
  readonly id: IndigenousTrunkId;
  readonly name: string;
  readonly peoplesExamples: readonly string[];
  readonly regionsLabel: string;
  readonly states: readonly StateCode[];
  readonly centroid: LngLat;
  readonly color: string;
  readonly pattern: CartographicPattern;
  readonly summary: string;
  readonly culturalLegacy: string;
  readonly presentDayPresence: string;
}

/** Ponte analítica entre o processo histórico e o Brasil contemporâneo. */
export interface PresentDayBridge {
  readonly headline: string;
  readonly summary: string;
  readonly indicators: readonly string[];
}

/** Fio de continuidade ligando ao menos dois marcos históricos através das eras. */
export interface ContinuityThread {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly color: string;
  readonly eventIds: readonly [string, string, ...string[]];
  readonly lenses: readonly TheoreticalLensId[];
  readonly presentDaySynthesis: string;
}

/** Recortes cartográficos históricos das fronteiras e divisões territoriais do Brasil. */
export type TerritorialSnapshotId =
  | 'tordesilhas_1500'
  | 'capitanias_1534'
  | 'madri_1750'
  | 'imperio_1850'
  | 'republica_1889';

/** Marco histórico georreferenciado do Atlas da Formação do Brasil. */
export interface HistoricalEvent {
  readonly id: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly year: number;
  readonly yearLabel: string;
  readonly era: EraId;
  readonly dimensions: readonly [DimensionId, ...DimensionId[]];
  readonly symbol: MapSymbolId;
  readonly locationName: string;
  readonly stateCodes: readonly StateCode[];
  readonly coordinates: LngLat;
  readonly summary: string;
  readonly historicalContext: string;
  readonly theoreticalReadings: readonly [
    TheoreticalReading,
    ...TheoreticalReading[],
  ];
  readonly presentDayBridge: PresentDayBridge;
  readonly relatedEventIds: readonly string[];
  readonly darcyBrasilId?: DarcyBrasilId;
  readonly territorialSnapshotId?: TerritorialSnapshotId;
}
