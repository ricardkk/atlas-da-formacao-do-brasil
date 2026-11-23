import type {
  ContinuityThread,
  DarcyBrasil,
  DarcyBrasilId,
  IndigenousMatrix,
  StateCode,
} from '../types';

/**
 * Os 5 Brasis definidos por Darcy Ribeiro em *O Povo Brasileiro* (1995).
 * As 27 UFs estão particionadas de forma exclusiva em `states` (sem sobreposição)
 * para coloração cartográfica inequívoca; áreas de transição regional são
 * documentadas em `DARCY_BRASIS_TRANSITION_STATES` e nos textos editoriais.
 */
export const DARCY_BRASIS: readonly DarcyBrasil[] = [
  {
    id: 'crioulo',
    name: 'Brasil Crioulo',
    subtitle: 'Engenhos, Casa-Grande, Senzala e Cultura Afro-Brasileira',
    states: ['RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
    centroid: [-38.5, -10.8],
    color: '#B85336',
    economicBase:
      'Empresa açucareira escravista na Zona da Mata e no Recôncavo, articulada ao tráfico atlântico e posteriormente convertida em usinas e polos portuários.',
    culturalMatrix:
      'Caldeamento afro-luso-tupi com centralidade africana (troncos bantu, sudanês e malê), expressa nos cultos de matriz africana, na culinária, na música, nas irmandades e na resistência quilombola; projeta áreas de transição no Rio de Janeiro, Espírito Santo, Minas Gerais e Maranhão.',
    summary:
      'Desenvolvido na faixa litorânea do Rio Grande do Norte à Bahia, o Brasil Crioulo nasceu em torno do engenho de açúcar como fábrica agroindustrial escravista. Sob a polarização extrema entre casa-grande e senzala, forjou-se uma das matrizes culturais mais densas do país, marcada pela resistência de Palmares e pela recriação afro-brasileira da língua e da religiosidade.',
    presentDayEcho:
      'Persiste tanto na vitalidade artística, religiosa e musical do Nordeste litorâneo quanto na profunda desigualdade racial, fundiária e urbana herdada de uma abolição sem terra nem escola.',
    relatedEventIds: [
      'colonia-matriz-tupi-1500',
      'colonia-engenho-acucar-1549',
      'colonia-palmares-1597',
      'imperio-abolicao-1888',
    ],
  },
  {
    id: 'caboclo',
    name: 'Brasil Caboclo',
    subtitle: 'Bacia Amazônica, Povos da Floresta e Ciclos Extrativos',
    states: ['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'MA'],
    centroid: [-59.5, -4.2],
    color: '#2F5D50',
    economicBase:
      'Extrativismo florestal ("drogas da mata", borracha, castanha), pesca ribeirinha, agricultura de várzea e frentes contemporâneas de mineração e agropecuária.',
    culturalMatrix:
      'Forte continuidade indígena amazônica articulada à língua geral (nheengatu), aos descimentos missionários e ao fluxo de cerca de meio milhão de migrantes nordestinos no ciclo da borracha; áreas de transição estendem-se ao norte de Mato Grosso e Tocantins.',
    summary:
      'Na imensa bacia Amazônica, a colonização combinou missões jesuíticas, coleta de drogas do sertão e, depois, o regime opressivo do seringal, do barracão e do regatão. A Cabanagem (1835–1840) expressou a insurgência dessa população cabocla e indígena marginalizada, cuja luta pela floresta ganhou projeção mundial com Chico Mendes e os povos da mata.',
    presentDayEcho:
      'O Brasil Caboclo está no centro da agenda climática global, onde saberes ribeirinhos e territórios indígenas e extrativistas disputam espaço contra o desmatamento, a grilagem e a mineração predatória.',
    relatedEventIds: [
      'colonia-tratado-madri-1750',
      'imperio-cabanagem-1835',
      'imperio-ciclo-borracha-1879',
      'republica-chico-mendes-1988',
    ],
  },
  {
    id: 'sertanejo',
    name: 'Brasil Sertanejo',
    subtitle: 'Currais, Caatinga, Cerrado e Resistência Messianista',
    states: ['CE', 'PI', 'TO', 'GO', 'DF'],
    centroid: [-44.5, -9.8],
    color: '#C78A3B',
    economicBase:
      'Pastoreio extensivo nascido como economia subsidiária do açúcar (sistema da quarta), cultivo de algodão mocó, agricultura de subsistência e, a partir de meados do século XX, expansão agroindustrial no Cerrado.',
    culturalMatrix:
      'Síntese de vaqueiros mamelucos, populações indígenas interioranas e libertos, marcada pela cultura do couro, pela literatura de cordel, pela religiosidade popular e por forte memória comunitária; estende-se pelo agreste e sertão interior da Bahia, Pernambuco, Paraíba e Rio Grande do Norte.',
    summary:
      'Expandindo-se pelos currais do rio São Francisco rumo às caatingas e cerrados, o Brasil Sertanejo estruturou uma sociedade pastoril apartada do litoral, marcada pelo latifúndio, pelas secas periódicas e pela chamada "indústria da seca". Seus impasses sociais eclodiram no cangaço, no messianismo e na destruição de Canudos (1897), antes de alimentar grandes correntes migratórias para a Amazônia, Brasília e o Sudeste.',
    presentDayEcho:
      'Convive hoje com o contraste entre a expansão do agronegócio tecnificado no Cerrado, a busca por convivência sustentável com o semiárido e a forte presença cultural sertaneja nas metrópoles brasileiras.',
    relatedEventIds: [
      'colonia-currais-sao-francisco-1650',
      'republica-canudos-1897',
      'republica-brasilia-1960',
    ],
  },
  {
    id: 'caipira',
    name: 'Brasil Caipira',
    subtitle: 'Bandeiras, Mineração, Café e Metrópole Industrial',
    states: ['SP', 'MG', 'RJ', 'ES', 'MT', 'MS'],
    centroid: [-47.8, -20.5],
    color: '#6E5A47',
    economicBase:
      'Economia inicial de pobreza e bandeiras paulistas, mineração aurífera em Minas, Mato Grosso e Goiás, agricultura camponesa de mutirão, marcha do café e industrialização urbano-fabril.',
    culturalMatrix:
      'Originada dos criatórios de mamelucos do cunhadismo paulista e da língua geral, reconfigurada pela mineração (o "nó que atou o Brasil"), pelo colonato imigrante nas fazendas de café e pelo êxodo rural acelerado do século XX; possui zonas de transição com o norte do Paraná e Goiás.',
    summary:
      'Nascido na periferia pobre do planalto de Piratininga, o Brasil Caipira projetou-se sobre o continente pelas bandeiras e monções, unificou o país com a mineração do século XVIII e reencontrou dinamismo com a marcha do café do Vale do Paraíba ao Oeste Paulista. A Lei de Terras (1850) e a industrialização do século XX converteram seu núcleo no maior polo urbano-industrial da América do Sul.',
    presentDayEcho:
      'Combina o maior parque industrial e financeiro do país com metrópoles profundamente desiguais, ao mesmo tempo em que preserva traços da sociabilidade rural, da música de viola e da memória dos bairros caipiras.',
    relatedEventIds: [
      'colonia-cunhadismo-sao-vicente-1532',
      'colonia-ouro-minas-1698',
      'imperio-independencia-1822',
      'imperio-lei-de-terras-1850',
      'republica-semana-22-1922',
      'republica-industrializacao-vargas-1941',
      'republica-constituicao-1988',
    ],
  },
  {
    id: 'sulino',
    name: 'Brasis Sulinos',
    subtitle: 'Gaúchos, Matutos e Gringos na Fronteira Meridional',
    states: ['PR', 'SC', 'RS'],
    centroid: [-51.8, -27.5],
    color: '#2B4570',
    economicBase:
      'Pecuária extensiva e charqueadas da campanha gaúcha, exploração ervateira e madeireira do planalto, pequenas propriedades policultoras de colonos europeus e indústria artesanal-fabril.',
    culturalMatrix:
      'Mosaico de três formações descritas por Darcy Ribeiro: os gaúchos (fronteira platina, Missões Jesuíticas e estâncias), os matutos (colonização açoriana e caboclos do planalto, protagonistas do Contestado) e os gringos (imigrantes alemães, italianos, poloneses e japoneses); transita para São Paulo e Mato Grosso do Sul.',
    summary:
      'Região marcada por disputas fronteiriças entre Portugal e Espanha, os Brasis Sulinos abrigaram os Sete Povos das Missões, as Vacarias del Mar e a Revolução Farroupilha. A partir do século XIX, políticas oficiais de colonização europeia criaram ilhas de pequena propriedade familiar que conviveram com o latifúndio estancieiro e com conflitos agrários agudos, como a Guerra do Contestado (1912–1916).',
    presentDayEcho:
      'Reflete-se no cooperativismo agroindustrial, na rede de cidades médias industrializadas e nas tensões entre a celebração das heranças imigrantes e o reconhecimento das populações negras, indígenas e caboclas da região.',
    relatedEventIds: [
      'imperio-farroupilha-1835',
      'imperio-imigracao-sulina-1875',
      'republica-contestado-1912',
    ],
  },
];

/**
 * Estados de transição cultural entre os 5 Brasis de Darcy Ribeiro,
 * preservados como referência complementar sem gerar sobreposição na partição principal.
 */
export const DARCY_BRASIS_TRANSITION_STATES: Record<
  DarcyBrasilId,
  readonly StateCode[]
> = {
  crioulo: ['RJ', 'ES', 'MG', 'MA'],
  caboclo: ['TO', 'MT'],
  sertanejo: ['BA', 'PE', 'PB', 'RN', 'MA'],
  caipira: ['GO', 'PR'],
  sulino: ['SP', 'MS'],
};

/** Quatro grandes troncos e famílias linguístico-culturais indígenas no território brasileiro. */
export const INDIGENOUS_MATRICES: readonly IndigenousMatrix[] = [
  {
    id: 'tupi',
    name: 'Tronco Tupi',
    peoplesExamples: ['Tupinambá', 'Tupiniquim', 'Guarani', 'Munduruku', 'Guajajara'],
    regionsLabel: 'Faixa litorânea, Bacia Amazônica e Bacia do Paraná-Paraguai',
    states: ['BA', 'PE', 'RN', 'RJ', 'SP', 'PR', 'SC', 'RS', 'MS', 'PA', 'MA', 'AM'],
    centroid: [-41.5, -13.5],
    color: '#2F5D50',
    pattern: 'waves',
    summary:
      'Matriz originária de maior contato inicial com os europeus, os povos de língua tupi ocupavam grande parte da costa brasileira e grandes rios interiores. Dominavam a agricultura tropical da mandioca — incluindo a técnica complexa de extração do ácido cianídrico — e organizavam aldeias agrícolas móveis que resistiram em alianças como a Confederação dos Tamoios (1563–1567).',
    culturalLegacy:
      'Forneceu a base da língua geral (nheengatu), milhares de topônimos, nomes de fauna e flora, técnicas agrícolas da mandioca e do milho, o hábito do banho diário, a rede de dormir e saberes medicinais da mata.',
    presentDayPresence:
      'Povos Guarani, Guajajara, Munduruku, Potiguara, Tupinambá e dezenas de outras etnias mantêm viva a luta pela demarcação de terras, pela retomada linguística e pela proteção da biodiversidade.',
  },
  {
    id: 'macro_je',
    name: 'Tronco Macro-Jê',
    peoplesExamples: ['Bororo', 'Xavante', 'Kayapó', 'Kaingang', 'Krenak', 'Maxakali'],
    regionsLabel: 'Planalto Central, Cerrado, Caatinga interior e Planalto Meridional',
    states: ['MT', 'GO', 'TO', 'MG', 'BA', 'MA', 'PA', 'PR', 'SC', 'RS'],
    centroid: [-49.5, -11.8],
    color: '#B85336',
    pattern: 'hatch',
    summary:
      'Chamados genericamente de "Tapuia" pelos colonizadores e pelos Tupi, os povos do tronco Macro-Jê dominavam os cerrados, campos e matas do interior do continente. Possuem sistemas sofisticados de organização social em metades clânicas, aldeias circulares, manejo do fogo no Cerrado e intensa vida cerimonial.',
    culturalLegacy:
      'Técnicas ancestrais de manejo sustentável do Cerrado, conhecimentos botânicos de longa duração, artes corporais e plumárias e formas comunitárias de deliberação coletiva.',
    presentDayPresence:
      'Povos como Kayapó, Xavante, Bororo, Kaingang e Krenak exercem protagonismo na defesa do Cerrado, das bacias hidrográficas e dos direitos constitucionais indígenas no Brasil contemporâneo.',
  },
  {
    id: 'arawak',
    name: 'Família Arawak (Aruaque)',
    peoplesExamples: ['Baniwa', 'Terena', 'Waurá', 'Mehinako', 'Ashaninka'],
    regionsLabel: 'Alto Rio Negro, Alto Xingu, Amazônia Ocidental e Pantanal',
    states: ['AM', 'AC', 'RO', 'MT', 'MS', 'RR'],
    centroid: [-63.5, -2.5],
    color: '#2B4570',
    pattern: 'dots',
    summary:
      'Uma das famílias linguísticas mais amplamente dispersas das Américas, os povos Arawak estabeleceram extensas redes fluviais de comércio, diplomacia interétnica e agricultura intensiva de várzea, destacando-se pela produção cerâmica refinada e pela organização de sistemas regionais multilíngues como o Alto Xingu e o Alto Rio Negro.',
    culturalLegacy:
      'Tradição ceramista, cestaria geométrica, domesticação de variedades amazônicas de mandioca e pimentas e modelos de convivência diplomática entre povos distintos.',
    presentDayPresence:
      'Lideranças Terena, Baniwa, Ashaninka e alto-xinguanas destacam-se na educação escolar indígena, na gestão territorial autônoma e no enfrentamento a invasões de fronteira.',
  },
  {
    id: 'karib',
    name: 'Família Karib (Caribe)',
    peoplesExamples: ['Macuxi', 'Kuikuro', 'Kalapalo', 'Tiriyó', 'Waiwai'],
    regionsLabel: 'Escudo das Guianas, Norte Amazônico e Alto Xingu',
    states: ['RR', 'PA', 'AP', 'AM', 'MT'],
    centroid: [-58.5, 1.5],
    color: '#7A5C38',
    pattern: 'cross',
    summary:
      'Concentrados sobretudo no norte amazônico (Escudo das Guianas) e no Alto Xingu, os povos Karib desenvolveram notável domínio da navegação fluvial, redes de troca de longa distância e formas complexas de assentamento amazônico pré-colonial, cuja escala foi redimensionada pela arqueologia contemporânea.',
    culturalLegacy:
      'Engenharia de aldeias e caminhos interfluviais, saberes astronômicos e ecológicos da floresta de terra firme e rituais interaldeias como o Kuarup no Alto Xingu.',
    presentDayPresence:
      'Povos como Macuxi (na Terra Indígena Raposa Serra do Sol), Tiriyó, Waiwai e Kuikuro são referências na vigilância territorial da fronteira norte e na produção audiovisual e científica indígena.',
  },
];

/**
 * Quatro Fios de Continuidade estruturantes que atravessam Colônia, Império e República,
 * permitindo visualizar no mapa processos de longa duração em ordem cronológica.
 */
export const CONTINUITY_THREADS: readonly ContinuityThread[] = [
  {
    id: 'patrimonialismo-estado',
    title: 'Patrimonialismo, Poder Local e Estado',
    subtitle: 'Das Capitanias Hereditárias à Constituição Cidadã',
    description:
      'Acompanha como o Estado brasileiro se formou a partir da delegação privada da Coroa e do domínio patriarcal local, atravessando a continuidade monárquica de 1822, o coronelismo republicano e o desenvolvimentismo estatal até a luta pela impessoalidade democrática em 1988.',
    color: '#2B4570',
    eventIds: [
      'colonia-cunhadismo-sao-vicente-1532',
      'imperio-independencia-1822',
      'republica-canudos-1897',
      'republica-industrializacao-vargas-1941',
      'republica-constituicao-1988',
    ],
    lenses: ['patrimonialismo', 'homem_cordial', 'aventureiro_trabalhador'],
    presentDaySynthesis:
      'A tensão entre a esfera pública republicana e a captura privada do Estado permanece no centro dos debates sobre orçamento público, federalismo, justiça fiscal e fortalecimento institucional.',
  },
  {
    id: 'terra-trabalho-desigualdade',
    title: 'Terra, Trabalho e Desigualdade Estrutural',
    subtitle: 'Do Engenho Escravista à Exclusão Agrária e Urbana',
    description:
      'Liga os mecanismos que concentraram a propriedade da terra e desvalorizaram o trabalho ao longo de cinco séculos: a escravidão açucareira, a resistência de Palmares, o bloqueio fundiário da Lei de Terras de 1850, a abolição sem reparação em 1888 e os conflitos agrários republicanos como o Contestado.',
    color: '#B85336',
    eventIds: [
      'colonia-engenho-acucar-1549',
      'colonia-palmares-1597',
      'imperio-lei-de-terras-1850',
      'imperio-abolicao-1888',
      'republica-contestado-1912',
    ],
    lenses: ['moinho_de_gastar_gente', 'patrimonialismo', 'povos_novos'],
    presentDaySynthesis:
      'Explica a persistência da concentração fundiária, do racismo estrutural, da informalidade laboral e da segregação socioespacial nas periferias das grandes cidades brasileiras.',
  },
  {
    id: 'matrizes-identidade-sincretismo',
    title: 'Matrizes Étnicas, Caldeamento e Identidade',
    subtitle: 'Da Matriz Tupi e do Cunhadismo ao Brasil Pluriétnico',
    description:
      'Traça a gestação do "Povo Novo" brasileiro desde o encontro inicial com os povos Tupi e o cunhadismo mameluco, passando pela incorporação dos imigrantes nos Brasis Sulinos, pela reelaboração estética da Semana de 1922 e pelo reconhecimento constitucional dos direitos indígenas e quilombolas em 1988.',
    color: '#2F5D50',
    eventIds: [
      'colonia-matriz-tupi-1500',
      'colonia-cunhadismo-sao-vicente-1532',
      'imperio-imigracao-sulina-1875',
      'republica-semana-22-1922',
      'republica-constituicao-1988',
    ],
    lenses: ['povos_novos', 'cunhadismo', 'homem_cordial'],
    presentDaySynthesis:
      'Supera o mito da democracia racial ao reconhecer tanto a criatividade singular da cultura brasileira quanto a necessidade de políticas afirmativas e demarcação territorial.',
  },
  {
    id: 'extrativismo-fronteiras-urbanizacao',
    title: 'Fronteiras, Extrativismo e Interiorização',
    subtitle: 'Dos Currais e Minas à Amazônia e ao Planalto Central',
    description:
      'Mostra como ciclos econômicos expansivos e disputas de fronteira redesenharam o território continental: a pecuária no São Francisco, o ouro que atou o Brasil, o Tratado de Madri, o ciclo da borracha, a construção de Brasília no Cerrado e a defesa socioambiental da Amazônia liderada por Chico Mendes.',
    color: '#7A5C38',
    eventIds: [
      'colonia-currais-sao-francisco-1650',
      'colonia-ouro-minas-1698',
      'colonia-tratado-madri-1750',
      'imperio-ciclo-borracha-1879',
      'republica-brasilia-1960',
      'republica-chico-mendes-1988',
    ],
    lenses: ['aventureiro_trabalhador', 'moinho_de_gastar_gente', 'povos_novos'],
    presentDaySynthesis:
      'A disputa contemporânea entre conservação da Amazônia e do Cerrado e expansão de fronteiras extrativas atualiza a contradição histórica entre colonização predatória e desenvolvimento sustentável.',
  },
];
