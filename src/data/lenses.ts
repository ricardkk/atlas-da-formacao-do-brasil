import type { TheoreticalLens } from '../types';

/**
 * Seis lentes conceituais estruturantes do Atlas:
 * três de Sérgio Buarque de Holanda (*Raízes do Brasil*, 1936)
 * e três de Darcy Ribeiro (*O Povo Brasileiro*, 1995).
 */
export const THEORETICAL_LENSES: readonly TheoreticalLens[] = [
  {
    id: 'aventureiro_trabalhador',
    author: 'sergio_buarque',
    authorName: 'Sérgio Buarque de Holanda',
    workTitle: 'Raízes do Brasil',
    workYear: 1936,
    title: 'Aventureiro vs. Trabalhador',
    shortLabel: 'Aventureiro vs. Trabalhador',
    definition:
      'Em Raízes do Brasil, Sérgio Buarque opõe dois tipos ideais de ação colonial: o aventureiro, movido pela audácia, pelo improviso e pela busca de recompensa imediata com mínimo esforço metódico, e o trabalhador, orientado pela disciplina, pela rotina e pela previsão de longo prazo. Na ocupação do território, essa ética se traduz na postura portuguesa do "semeador" — adaptável, dispersa e orgânica — em contraste com o rigor geométrico do "ladrilhador" hispânico.',
    contemporaryRelevance:
      'Ajuda a compreender ciclos econômicos extrativos de curto prazo, a ocupação urbana frequentemente desordenada e a dificuldade histórica de sustentar políticas públicas de planejamento contínuo.',
    accentColor: '#B85336',
  },
  {
    id: 'homem_cordial',
    author: 'sergio_buarque',
    authorName: 'Sérgio Buarque de Holanda',
    workTitle: 'Raízes do Brasil',
    workYear: 1936,
    title: 'O Homem Cordial',
    shortLabel: 'Homem Cordial',
    definition:
      'Conceito formulado em Raízes do Brasil para designar o predomínio das relações de fundo emotivo, pessoal e íntimo — vindas do coração, abrangendo tanto afetos e hospitalidade quanto inimizades e aversão à impessoalidade — sobre as normas abstratas e ritualizadas da esfera cívica. Não significa mera bondade, mas resistência à impessoalidade jurídica e burocrática.',
    contemporaryRelevance:
      'Manifesta-se na cultura política personalista, na preferência por mediações informais ("jeitinho") e na tensão permanente entre laços pessoais e igualdade perante a lei.',
    accentColor: '#9C4A33',
  },
  {
    id: 'patrimonialismo',
    author: 'sergio_buarque',
    authorName: 'Sérgio Buarque de Holanda',
    workTitle: 'Raízes do Brasil',
    workYear: 1936,
    title: 'Patrimonialismo e Ruralismo Patriarcal',
    shortLabel: 'Patrimonialismo',
    definition:
      'Em diálogo com a sociologia weberiana em Raízes do Brasil, Sérgio Buarque mostra como a família patriarcal dos engenhos e fazendas projetou sua lógica doméstica sobre o Estado brasileiro. Disso resulta a indistinção entre o público e o privado, o bacharelismo voltado ao prestígio de cargos e reformas conduzidas de cima para baixo sem ruptura profunda das hierarquias.',
    contemporaryRelevance:
      'Explica a persistência do clientelismo, da captura privada do orçamento público, da concentração fundiária e de privilégios estamentais na administração do Estado.',
    accentColor: '#2B4570',
  },
  {
    id: 'povos_novos',
    author: 'darcy_ribeiro',
    authorName: 'Darcy Ribeiro',
    workTitle: 'O Povo Brasileiro',
    workYear: 1995,
    title: 'Povo Novo e Matrizes Étnicas',
    shortLabel: 'Povo Novo',
    definition:
      'Tese central de O Povo Brasileiro: o Brasil não é uma simples transplantação europeia nem a sobrevivência intacta de impérios indígenas, mas um Povo Novo, surgido da confluência, do entrechoque e do caldeamento das matrizes tupi/indígena, lusa e africana sob regência colonial portuguesa. Apesar da desigualdade extrema, esse processo forjou uma unidade linguística e cultural singular que se desdobra nos Cinco Brasis.',
    contemporaryRelevance:
      'Permite ler o Brasil contemporâneo simultaneamente em sua unidade cultural nacional e em sua profunda heterogeneidade regional, racial e socioeconômica.',
    accentColor: '#2F5D50',
  },
  {
    id: 'cunhadismo',
    author: 'darcy_ribeiro',
    authorName: 'Darcy Ribeiro',
    workTitle: 'O Povo Brasileiro',
    workYear: 1995,
    title: 'Cunhadismo e Transfiguração Étnica',
    shortLabel: 'Cunhadismo',
    definition:
      'Em O Povo Brasileiro, Darcy Ribeiro identifica o cunhadismo como a instituição tupi de incorporar estranhos à rede de parentesco por meio da união com mulheres indígenas (temericó). Apropriado pelos primeiros colonos portugueses, gerou os criatórios de mamelucos (brasilíndios) que viabilizaram a ocupação colonial, ao mesmo tempo em que desencadeou a transfiguração étnica dos povos indígenas nas instâncias biótica, ecológica, econômica e psicocultural.',
    contemporaryRelevance:
      'Ilumina as origens assimétricas da mestiçagem brasileira, a marca indígena na língua e nos costumes cotidianos e a luta histórica dos povos originários contra o etnocídio e a perda territorial.',
    accentColor: '#3E6B5C',
  },
  {
    id: 'moinho_de_gastar_gente',
    author: 'darcy_ribeiro',
    authorName: 'Darcy Ribeiro',
    workTitle: 'O Povo Brasileiro',
    workYear: 1995,
    title: 'Moinho de Gastar Gente e Proletariado Externo',
    shortLabel: 'Moinho de Gastar Gente',
    definition:
      'Metáfora estruturante de O Povo Brasileiro para descrever a empresa colonial escravista e mercantil, organizada como feitoria exportadora ("proletariado externo") a serviço do mercado mundial e dirigida por uma elite exógena. O engenho, a mina e o latifúndio consumiram milhões de vidas indígenas e africanas, forçando populações desenraizadas a superar a "ninguendade" — não ser mais índio, africano nem europeu — para inventar a identidade brasileira.',
    contemporaryRelevance:
      'Conecta a herança escravista e a abolição sem reparação ao racismo estrutural, à precarização do trabalho, à concentração de renda e à segregação urbana nas metrópoles.',
    accentColor: '#6B3E2E',
  },
];
