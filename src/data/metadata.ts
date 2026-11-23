import type {
  DimensionId,
  DimensionMetadata,
  EraId,
  EraMetadata,
  MapSymbolId,
  MapSymbolMetadata,
  TerritorialSnapshot,
} from '../types';

/** Metadados editoriais e cromáticos das três grandes eras da formação brasileira. */
export const ERAS: Record<EraId, EraMetadata> = {
  colonia: {
    id: 'colonia',
    label: 'Brasil Colônia',
    shortLabel: 'Colônia',
    periodLabel: '1500–1822',
    startYear: 1500,
    endYear: 1822,
    summary:
      'Gestação étnica e territorial sob o sistema colonial mercantil: encontro entre matrizes indígenas, portuguesas e africanas, empresa açucareira escravista, expansão sertanista, mineração e conformação das fronteiras continentais.',
    color: '#B85336',
    tailwindToken: 'terracotta',
  },
  imperio: {
    id: 'imperio',
    label: 'Brasil Império',
    shortLabel: 'Império',
    periodLabel: '1822–1889',
    startYear: 1822,
    endYear: 1889,
    summary:
      'Construção do Estado monárquico unitário em meio a rebeliões provinciais, consolidação da economia cafeeira, Lei de Terras, imigração europeia, ciclo da borracha e abolição tardia sem integração social dos libertos.',
    color: '#2B4570',
    tailwindToken: 'indigo-atlas',
  },
  republica: {
    id: 'republica',
    label: 'Brasil República',
    shortLabel: 'República',
    periodLabel: '1889–presente',
    startYear: 1889,
    endYear: 2025,
    summary:
      'Transição do país agrário-oligárquico à sociedade urbano-industrial: conflitos sertanejos e agrários, redescoberta cultural modernista, industrialização estatal, marcha para o Cerrado e Amazônia, e reconstrução democrática.',
    color: '#2F5D50',
    tailwindToken: 'forest',
  },
};

/** Metadados das três dimensões analíticas usadas na filtragem dos marcos. */
export const DIMENSIONS: Record<DimensionId, DimensionMetadata> = {
  economia: {
    id: 'economia',
    label: 'Economia & Trabalho',
    description:
      'Regimes de trabalho, ciclos extrativos e agroexportadores, propriedade da terra, industrialização e desigualdade estrutural.',
    color: '#B85336',
  },
  cultura: {
    id: 'cultura',
    label: 'Cultura & Identidade',
    description:
      'Matrizes étnicas, caldeamento, sincretismo religioso, línguas, resistência cultural e formação das áreas culturais brasileiras.',
    color: '#2F5D50',
  },
  politica: {
    id: 'politica',
    label: 'Política & Estado',
    description:
      'Formação do Estado, patrimonialismo, disputas de fronteira, insurreições populares, federalismo e construção da cidadania.',
    color: '#2B4570',
  },
};

/** Legenda cartográfica dos onze símbolos usados nos marcadores do mapa. */
export const MAP_SYMBOLS: Record<MapSymbolId, MapSymbolMetadata> = {
  engenho: {
    id: 'engenho',
    label: 'Engenho',
    description: 'Empresa açucareira escravista e complexos agroindustriais coloniais.',
    category: 'economia',
  },
  ouro: {
    id: 'ouro',
    label: 'Mineração',
    description: 'Ciclos mineradores que interiorizaram o povoamento e articularam o mercado interno.',
    category: 'economia',
  },
  bandeira: {
    id: 'bandeira',
    label: 'Fronteira & Expedição',
    description: 'Entradas, missões, tratados de limites e consolidação do território continental.',
    category: 'politica',
  },
  embarcacao: {
    id: 'embarcacao',
    label: 'Rota Atlântica & Fluvial',
    description: 'Portos coloniais, navegação amazônica e redes de circulação mercantil e migratória.',
    category: 'economia',
  },
  cafe: {
    id: 'cafe',
    label: 'Café & Terra',
    description: 'Frente cafeeira, mercantilização fundiária e transição ao trabalho assalariado.',
    category: 'economia',
  },
  industria: {
    id: 'industria',
    label: 'Indústria',
    description: 'Siderurgia de base, substituição de importações e formação do operariado urbano.',
    category: 'economia',
  },
  cultura: {
    id: 'cultura',
    label: 'Cultura & Resistência',
    description: 'Quilombos, sincretismos, movimentos estéticos e formação das identidades regionais.',
    category: 'cultura',
  },
  aldeia: {
    id: 'aldeia',
    label: 'Povos Originários & Floresta',
    description: 'Territórios indígenas, ecologia florestal e defesa contemporânea dos povos da mata.',
    category: 'cultura',
  },
  politica: {
    id: 'politica',
    label: 'Estado & Conflito',
    description: 'Insurreições, rupturas institucionais, constituições e disputas por soberania e direitos.',
    category: 'politica',
  },
  pecuaria: {
    id: 'pecuaria',
    label: 'Pecuária & Sertão',
    description: 'Frentes pastoris dos currais nordestinos às estâncias da campanha gaúcha.',
    category: 'economia',
  },
  urbanizacao: {
    id: 'urbanizacao',
    label: 'Urbanização & Metrópole',
    description: 'Planejamento estatal, interiorização da capital e transição demográfica urbana.',
    category: 'cultura',
  },
};

/** Recortes cartográficos históricos das fronteiras e divisões do Brasil. */
export const TERRITORIAL_SNAPSHOTS: readonly TerritorialSnapshot[] = [
  {
    id: 'tordesilhas_1500',
    year: 1500,
    label: 'Meridiano de Tordesilhas (1494/1500)',
    shortLabel: 'Tordesilhas (1500)',
    era: 'colonia',
    description:
      'Linha diplomática traçada a 370 léguas a oeste de Cabo Verde que repartia o Novo Mundo entre Portugal e Castela, deixando a maior parte da Amazônia e do Centro-Oeste fora da posse formal portuguesa.',
    treatyOrMilestone: 'Tratado de Tordesilhas (1494)',
    color: '#B85336',
  },
  {
    id: 'capitanias_1534',
    year: 1534,
    label: 'Capitanias Hereditárias (1534)',
    shortLabel: 'Capitanias (1534)',
    era: 'colonia',
    description:
      'Faixas paralelas do litoral até o meridiano de Tordesilhas concedidas a donatários privados para viabilizar a ocupação colonial, combinando delegação patrimonial da Coroa com exploração agroexportadora.',
    treatyOrMilestone: 'Cartas de Doação e Forais (1534–1536)',
    color: '#A1462C',
  },
  {
    id: 'madri_1750',
    year: 1750,
    label: 'Tratado de Madri (1750)',
    shortLabel: 'Madri (1750)',
    era: 'colonia',
    description:
      'Reconhecimento diplomático do princípio do uti possidetis, incorporando formalmente a bacia Amazônica, o Centro-Oeste minerador e grande parte do Sul ao contorno aproximado do Brasil atual.',
    treatyOrMilestone: 'Tratado de Madri (1750)',
    color: '#8F3E28',
  },
  {
    id: 'imperio_1850',
    year: 1850,
    label: 'Províncias do Império (1850)',
    shortLabel: 'Império (1850)',
    era: 'imperio',
    description:
      'Configuração territorial do Império unitário após a pacificação das revoltas regenciais e a criação da província do Amazonas, sob forte centralização política no Rio de Janeiro.',
    treatyOrMilestone: 'Consolidação Provincial do Segundo Reinado (1850)',
    color: '#2B4570',
  },
  {
    id: 'republica_1889',
    year: 1889,
    label: 'Estados da República Federativa (1889)',
    shortLabel: 'República (1889)',
    era: 'republica',
    description:
      'Conversão das antigas províncias imperiais em estados federados com autonomia fiscal e política, completada nas décadas seguintes pela incorporação do Acre (1903) e pela criação de novos entes no século XX.',
    treatyOrMilestone: 'Proclamação da República e Constituição de 1891',
    color: '#2F5D50',
  },
];
