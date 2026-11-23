import type { HistoricalEvent } from '../types';

/**
 * Catálogo com 22 marcos históricos georreferenciados da formação do Brasil
 * (7 Colônia, 8 Império, 7 República), articulados às lentes teóricas de
 * Sérgio Buarque de Holanda (*Raízes do Brasil*) e Darcy Ribeiro (*O Povo Brasileiro*).
 */
export const HISTORICAL_EVENTS: readonly HistoricalEvent[] = [
  // =========================================================================
  // BRASIL COLÔNIA (7 marcos: 1500–1750)
  // =========================================================================
  {
    id: 'colonia-matriz-tupi-1500',
    title: 'A Ilha Brasil, a Matriz Tupi e o Encontro Atlântico',
    shortTitle: 'Matriz Tupi e 1500',
    year: 1500,
    yearLabel: '1500',
    era: 'colonia',
    dimensions: ['cultura', 'economia'],
    symbol: 'aldeia',
    locationName: 'Porto Seguro e Litoral da Bahia',
    stateCodes: ['BA'],
    coordinates: [-39.06, -16.45],
    summary:
      'O desembarque português encontra uma civilização tupi densamente instalada no litoral — sustentada pela domesticação da mandioca e por aldeias agrícolas — e inaugura um choque biótico, ecológico e cultural de escala continental.',
    historicalContext:
      'Antes de 1500, milhões de indígenas de troncos como Tupi, Macro-Jê, Arawak e Karib habitavam o que Darcy Ribeiro chama de "Ilha Brasil". Os povos Tupi dominavam a agricultura tropical, incluindo a técnica sofisticada de extração do ácido cianídrico da mandioca brava, e organizavam sociedades igualitárias sem Estado. A chegada da frota de Cabral sob o marco do Tratado de Tordesilhas (1494) abriu a extração do pau-brasil via escambo e desencadeou epidemias devastadoras e resistências como a Confederação dos Tamoios (1563–1567).',
    theoreticalReadings: [
      {
        lensId: 'cunhadismo',
        author: 'darcy_ribeiro',
        conceptLabel: 'Matriz Tupi e Transfiguração Étnica',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro demonstra que o encontro colonial desencadeou a transfiguração étnica nas quatro instâncias — biótica (epidemias), ecológica (uso da terra), econômica (escambo e servidão) e psicocultural (catequese) —, mas a matriz tupi forneceu a base ecológica, alimentar e linguística sem a qual a colonização não teria sobrevivido.',
      },
      {
        lensId: 'aventureiro_trabalhador',
        author: 'sergio_buarque',
        conceptLabel: 'Ética do Aventureiro',
        analysis:
          'Sob a lente de Raízes do Brasil, a fase inicial das feitorias e do escambo de pau-brasil expressa o ímpeto do aventureiro ibérico: buscar riqueza imediata e mobilidade comercial com o mínimo de enraizamento produtivo.',
      },
    ],
    presentDayBridge: {
      headline: 'Herança indígena cotidiana e disputa por direitos originários',
      summary:
        'A presença tupi sobrevive na alimentação baseada na mandioca, na toponímia de cidades e rios e em práticas de cuidado ambiental, enquanto povos indígenas enfrentam pressões contínuas sobre seus territórios demarcados.',
      indicators: [
        'Mais de 300 povos indígenas e cerca de 270 línguas vivas no Brasil contemporâneo',
        'Terras Indígenas atuando como barreiras decisivas contra o desmatamento na Amazônia e no Cerrado',
      ],
    },
    relatedEventIds: [
      'colonia-cunhadismo-sao-vicente-1532',
      'colonia-tratado-madri-1750',
      'republica-chico-mendes-1988',
    ],
    darcyBrasilId: 'crioulo',
    territorialSnapshotId: 'tordesilhas_1500',
  },
  {
    id: 'colonia-cunhadismo-sao-vicente-1532',
    title: 'Capitanias, Cunhadismo e a Protocélula Mameluca',
    shortTitle: 'Cunhadismo e Capitanias',
    year: 1532,
    yearLabel: '1532–1534',
    era: 'colonia',
    dimensions: ['cultura', 'politica'],
    symbol: 'embarcacao',
    locationName: 'São Vicente e Planalto de Piratininga',
    stateCodes: ['SP'],
    coordinates: [-46.39, -23.96],
    summary:
      'A fundação de São Vicente e o sistema de Capitanias Hereditárias (1534) apoiam-se no cunhadismo tupi — como na aliança de João Ramalho em Piratininga — para gerar os primeiros núcleos de mamelucos falantes de língua geral.',
    historicalContext:
      'Para assegurar a posse da terra diante de corsários europeus, a Coroa portuguesa fundou a vila de São Vicente (1532) e repartiu o litoral em Capitanias Hereditárias (1534), transferindo a particulares poderes fiscais e judiciais. Sem grande contingente demográfico português, a fixação em São Paulo (João Ramalho), na Bahia (Caramuru) e em Pernambuco dependeu da incorporação de colonos às redes de parentesco indígenas, produzindo a primeira geração de brasilíndios (mamelucos).',
    theoreticalReadings: [
      {
        lensId: 'cunhadismo',
        author: 'darcy_ribeiro',
        conceptLabel: 'Cunhadismo e Criatórios de Mamelucos',
        analysis:
          'Darcy Ribeiro identifica o cunhadismo — instituição tupi de tornar o estranho parente pela entrega de mulheres (temericó) — como o motor demográfico do Brasil colonial. Os mamelucos resultantes, falantes de nheengatu, não eram mais plenamente índios nem europeus, inaugurando a superação da "ninguendade".',
      },
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Delegação Patrimonial e Semeador',
        analysis:
          'Em Raízes do Brasil, a combinação entre donatários privados com prerrogativas públicas e uma ocupação litorânea flexível ("semeador") antecipa a fusão entre autoridade privada e esfera estatal.',
      },
    ],
    presentDayBridge: {
      headline: 'Raízes da mestiçagem assimétrica e do poder local',
      summary:
        'A formação colonial baseada na delegação privada de autoridade e na mestiçagem marcada por assimetrias de gênero e poder ecoa tanto na composição demográfica brasileira quanto na força histórica dos poderes locais.',
      indicators: [
        'Língua geral (nheengatu) falada amplamente até o século XVIII e ainda viva no Alto Rio Negro',
        'Permanência de estruturas familiares de poder em municípios e assembleias regionais',
      ],
    },
    relatedEventIds: [
      'colonia-matriz-tupi-1500',
      'colonia-ouro-minas-1698',
      'imperio-independencia-1822',
    ],
    darcyBrasilId: 'caipira',
    territorialSnapshotId: 'capitanias_1534',
  },
  {
    id: 'colonia-engenho-acucar-1549',
    title: 'Governo-Geral e a Empresa Açucareira Escravista',
    shortTitle: 'Empresa Açucareira',
    year: 1549,
    yearLabel: '1549',
    era: 'colonia',
    dimensions: ['economia', 'politica'],
    symbol: 'engenho',
    locationName: 'Salvador e Recôncavo Baiano',
    stateCodes: ['BA', 'PE'],
    coordinates: [-38.51, -12.97],
    summary:
      'A criação do Governo-Geral em Salvador centraliza a administração colonial enquanto o engenho de açúcar consolida o latifúndio monocultor e a escravidão africana em larga escala na costa nordestina.',
    historicalContext:
      'Com o fracasso da maioria das capitanias, a Coroa instalou o Governo-Geral em Salvador (1549) para articular defesa, arrecadação e expansão da lavoura canavieira. No Recôncavo Baiano e na Zona da Mata pernambucana, o engenho funcionou como uma fábrica agroindustrial voltada à exportação europeia, substituindo gradualmente a mão de obra indígena escravizada pelo tráfico transatlântico de africanos de troncos bantu, sudanês e malê.',
    theoreticalReadings: [
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Proletariado Externo e Moinho de Gastar Gente',
        analysis:
          'Para Darcy Ribeiro, o engenho é o coração da "Empresa Brasil": uma feitoria exportadora ("proletariado externo") regida por uma elite consular que moía vidas africanas e indígenas para gerar excedente no mercado europeu.',
      },
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Ruralismo Patriarcal',
        analysis:
          'Em Raízes do Brasil, a grande propriedade rural açucareira aparece como o verdadeiro centro da vida colonial: a casa-grande subordinava as vilas e projetava a autoridade do pater familias sobre a justiça e a política.',
      },
    ],
    presentDayBridge: {
      headline: 'Herança agroexportadora e concentração fundiária',
      summary:
        'A estrutura de grandes propriedades voltadas ao mercado externo e apoiadas em trabalho de baixa remuneração deixou marcas duradouras na distribuição da terra, da renda e do poder político.',
      indicators: [
        'Pauta exportadora brasileira ainda fortemente ancorada em commodities primárias',
        'Elevado índice de concentração fundiária herdado do modelo de sesmarias e engenhos',
      ],
    },
    relatedEventIds: [
      'colonia-palmares-1597',
      'colonia-currais-sao-francisco-1650',
      'imperio-abolicao-1888',
    ],
    darcyBrasilId: 'crioulo',
  },
  {
    id: 'colonia-palmares-1597',
    title: 'Quilombo dos Palmares e a Resistência Afro-Brasileira',
    shortTitle: 'Quilombo dos Palmares',
    year: 1597,
    yearLabel: '1597–1695',
    era: 'colonia',
    dimensions: ['cultura', 'politica'],
    symbol: 'cultura',
    locationName: 'Serra da Barriga (União dos Palmares)',
    stateCodes: ['AL', 'PE'],
    coordinates: [-36.03, -9.16],
    summary:
      'Por quase um século, a confederação de mocambos de Palmares desafiou o escravismo colonial, reunindo milhares de afro-brasileiros, indígenas e mestiços em uma sociedade autônoma liderada por Ganga Zumba e Zumbi.',
    historicalContext:
      'Formado no interior da capitania de Pernambuco (atual Alagoas) a partir do fim do século XVI, Palmares articulou dezenas de povoados fortificados com agricultura diversificada, metalurgia e comércio local. Resistiu a expedições holandesas e portuguesas até ser destruído em 1694–1695 por tropas bandeirantes comandadas por Domingos Jorge Velho, tornando-se símbolo máximo da luta negra por liberdade.',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Afro-Brasileiros e Superação da Ninguendade',
        analysis:
          'Darcy Ribeiro mostra que os africanos trazidos de povos distintos transitaram da condição de "boçais" a "ladinos", difundiram o português popular e, em Palmares e nas irmandades, afirmaram uma identidade afro-brasileira autônoma contra a desumanização escravista.',
      },
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Insurreição Contra a Empresa Escravista',
        analysis:
          'A longa resistência palmarina demonstra que o "moinho de gastar gente" nunca operou sem oposição ativa, obrigando o sistema colonial a mobilizar forças militares contínuas para conter fugas e levantes.',
      },
    ],
    presentDayBridge: {
      headline: 'Memória quilombola e titulação de territórios',
      summary:
        'Palmares inspira o Dia da Consciência Negra e a agenda contemporânea de reconhecimento e titulação de milhares de comunidades remanescentes de quilombos espalhadas por todo o país.',
      indicators: [
        'Mais de 3.500 comunidades quilombolas certificadas oficialmente no Brasil',
        'Direito constitucional à propriedade definitiva das terras quilombolas (ADCT, art. 68)',
      ],
    },
    relatedEventIds: [
      'colonia-engenho-acucar-1549',
      'imperio-abolicao-1888',
      'republica-constituicao-1988',
    ],
    darcyBrasilId: 'crioulo',
  },
  {
    id: 'colonia-currais-sao-francisco-1650',
    title: 'Expansão Pastoril e os Currais do São Francisco',
    shortTitle: 'Currais do São Francisco',
    year: 1650,
    yearLabel: 'Século XVII',
    era: 'colonia',
    dimensions: ['economia', 'cultura'],
    symbol: 'pecuaria',
    locationName: 'Médio São Francisco (Juazeiro e Sertão)',
    stateCodes: ['BA', 'PE', 'PI', 'CE'],
    coordinates: [-40.5, -9.41],
    summary:
      'A pecuária extensiva avança pelo vale do rio São Francisco para abastecer os engenhos litorâneos de carne, couro e tração animal, dando origem à sociedade do Brasil Sertanejo.',
    historicalContext:
      'Proibida de disputar as terras férteis de massapê com a cana-de-açúcar, a criação de gado interiorizou-se pelos sertões da Bahia, Pernambuco, Piauí e Ceará sob grandes latifúndios como a Casa da Torre. Organizada pelo regime da "quarta" — no qual o vaqueiro recebia uma em cada quatro crias —, a frente pastoril dizimou ou assimilou povos indígenas interioranos (Guerra dos Bárbaros) e consolidou uma economia dispersa de currais e feiras de gado.',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Gênese do Brasil Sertanejo',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro descreve o Brasil Sertanejo como fruto dessa economia pastoril subsidiária do açúcar, na qual o vaqueiro — figura mestiça de forte autonomia cotidiana, porém presa ao latifúndio — forjou uma cultura própria do couro e da caatinga.',
      },
      {
        lensId: 'aventureiro_trabalhador',
        author: 'sergio_buarque',
        conceptLabel: 'Ocupação Extensiva e Mobilidade',
        analysis:
          'A expansão pastoril pelo sertão reflete a adaptabilidade extensiva da colonização portuguesa descrita em Raízes do Brasil, espalhando fazendas e rotas de gado sem planejamento urbano rígido.',
      },
    ],
    presentDayBridge: {
      headline: 'Integração do São Francisco e dilemas do semiárido',
      summary:
        'O "rio da integração nacional" segue central para o abastecimento hídrico, a agricultura irrigada e o debate sobre convivência sustentável com o semiárido em oposição à velha política assistencialista das secas.',
      indicators: [
        'Bacia do São Francisco integrando mais de 500 municípios entre o Sudeste e o Nordeste',
        'Transição de políticas emergenciais para tecnologias sociais de captação de água (cisternas)',
      ],
    },
    relatedEventIds: [
      'colonia-engenho-acucar-1549',
      'colonia-ouro-minas-1698',
      'republica-canudos-1897',
    ],
    darcyBrasilId: 'sertanejo',
  },
  {
    id: 'colonia-ouro-minas-1698',
    title: 'Mineração das Gerais e o "Nó que Atou o Brasil"',
    shortTitle: 'Mineração das Gerais',
    year: 1698,
    yearLabel: '1698–1750',
    era: 'colonia',
    dimensions: ['economia', 'cultura', 'politica'],
    symbol: 'ouro',
    locationName: 'Ouro Preto (Vila Rica) e Minas Gerais',
    stateCodes: ['MG', 'SP', 'GO', 'MT'],
    coordinates: [-43.5, -20.39],
    summary:
      'A descoberta do ouro em Minas Gerais (1698), Mato Grosso (1719) e Goiás (1725) provoca a primeira grande corrida demográfica ao interior, transfere o eixo econômico para o Centro-Sul e integra o mercado interno colonial.',
    historicalContext:
      'Partindo do planalto paulista, as bandeiras revelaram jazidas auríferas que atraíram centenas de milhares de portugueses e africanos escravizados para Vila Rica, Sabará, Mariana, Cuiabá e Vila Boa. A demanda por alimentos, mulas de carga e charque conectou o Sul pastoril, o Nordeste pecuário e o porto do Rio de Janeiro — elevado a capital em 1763 —, enquanto vilas urbanas densas deram origem ao barroco mineiro e à Inconfidência de 1789.',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'O Nó que Atou o Brasil',
        analysis:
          'Darcy Ribeiro define a mineração como o "nó que atou o Brasil": ao articular o comércio de tropas, gado e alimentos entre todas as capitanias, transformou arquipélagos coloniais isolados em um corpo econômico e linguístico integrado, consolidando o Brasil Caipira.',
      },
      {
        lensId: 'aventureiro_trabalhador',
        author: 'sergio_buarque',
        conceptLabel: 'Súbita Urbanização e Espírito Aventureiro',
        analysis:
          'Em Raízes do Brasil, a febre do ouro ilustra a busca da riqueza súbita sem disciplina manufatureira duradoura: o brilho urbano e barroco das vilas mineiras foi seguido por rápida retração quando as jazidas superficiais se esgotaram.',
      },
    ],
    presentDayBridge: {
      headline: 'Integração Sudeste–Centro-Oeste e economia mineral',
      summary:
        'A rede viária e urbana inaugurada pelo ouro moldou o eixo Minas–Rio–São Paulo e o Centro-Oeste, enquanto a mineração contemporânea reacende debates sobre dependência extrativa e segurança socioambiental.',
      indicators: [
        'Minas Gerais permanece o principal polo minerador do país e patrimônio barroco mundial',
        'Discussão nacional sobre royalties minerais e prevenção de desastres em barragens',
      ],
    },
    relatedEventIds: [
      'colonia-cunhadismo-sao-vicente-1532',
      'colonia-tratado-madri-1750',
      'imperio-independencia-1822',
    ],
    darcyBrasilId: 'caipira',
  },
  {
    id: 'colonia-tratado-madri-1750',
    title: 'Tratado de Madri, Missões e a Fronteira Continental',
    shortTitle: 'Tratado de Madri',
    year: 1750,
    yearLabel: '1750',
    era: 'colonia',
    dimensions: ['politica', 'cultura'],
    symbol: 'bandeira',
    locationName: 'Santarém, Bacia Amazônica e Missões',
    stateCodes: ['PA', 'AM', 'RS'],
    coordinates: [-54.71, -2.44],
    summary:
      'O Tratado de Madri substitui a linha de Tordesilhas pelo princípio do uti possidetis, reconhecendo a expansão luso-brasileira na Amazônia e no Centro-Oeste enquanto desencadeia a tragédia das Guerras Guaraníticas no Sul.',
    historicalContext:
      'Negociado sob inspiração de Alexandre de Gusmão, o tratado de 1750 legitimou a ocupação efetiva portuguesa na Amazônia — construída sobre fortes, missões jesuíticas, coleta de "drogas da mata" e descimentos indígenas — em troca da Colônia do Sacramento pelos Sete Povos das Missões. A resistência guarani (1753–1756) foi esmagada e, logo depois, as reformas pombalinas expulsaram os jesuítas (1759) e proibiram oficialmente a língua geral (nheengatu).',
    theoreticalReadings: [
      {
        lensId: 'cunhadismo',
        author: 'darcy_ribeiro',
        conceptLabel: 'Empresa Jesuítica e Brasil Caboclo',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro analisa a "empresa comunitária jesuítica" nas Missões e na Amazônia como uma das ordens estruturantes da colônia: ao destribalizar indígenas em aldeamentos falantes de nheengatu, ela moldou a população cabocla amazônica e os guaranis missioneiros do Sul.',
      },
      {
        lensId: 'aventureiro_trabalhador',
        author: 'sergio_buarque',
        conceptLabel: 'Plasticidade Fronteiriça',
        analysis:
          'A dilatação das fronteiras muito além de Tordesilhas confirma a observação de Sérgio Buarque sobre a plasticidade adaptativa luso-brasileira, que avançou pelos rios amazônicos e pelo sertão antes mesmo de qualquer traçado diplomático.',
      },
    ],
    presentDayBridge: {
      headline: 'Soberania continental e fronteiras amazônicas',
      summary:
        'O desenho aproximado das fronteiras brasileiras foi consagrado em 1750, legando ao país o desafio permanente de integrar a bacia Amazônica com soberania e respeito aos povos indígenas e ribeirinhos.',
      indicators: [
        'Mais de 16 mil km de fronteiras terrestres definidas a partir da matriz do uti possidetis',
        'Sobrevivência cultural da língua nheengatu e das ruínas das Missões como patrimônio histórico',
      ],
    },
    relatedEventIds: [
      'colonia-matriz-tupi-1500',
      'imperio-cabanagem-1835',
      'imperio-farroupilha-1835',
    ],
    darcyBrasilId: 'caboclo',
    territorialSnapshotId: 'madri_1750',
  },

  // =========================================================================
  // BRASIL IMPÉRIO (8 marcos: 1822–1888)
  // =========================================================================
  {
    id: 'imperio-independencia-1822',
    title: 'Independência e a Continuidade Monárquico-Patrimonial',
    shortTitle: 'Independência (1822)',
    year: 1822,
    yearLabel: '1822',
    era: 'imperio',
    dimensions: ['politica'],
    symbol: 'politica',
    locationName: 'Rio de Janeiro e Eixo Corte–São Paulo',
    stateCodes: ['RJ', 'SP'],
    coordinates: [-43.17, -22.91],
    summary:
      'A emancipação política mantém a dinastia portuguesa, a integridade territorial e a escravidão, construindo um Estado imperial unitário que concilia os interesses dos grandes proprietários rurais.',
    historicalContext:
      'Após a transferência da Corte portuguesa para o Rio de Janeiro (1808) e a abertura dos portos, a ruptura de 1822 foi conduzida pelo príncipe regente Dom Pedro em aliança com setores da elite agrária do Centro-Sul, após lutas efetivas na Bahia, Maranhão, Pará e Cisplatina. A Constituição outorgada de 1824 instituiu o Poder Moderador e o voto censitário, preservando a ordem escravista e a centralização administrativa.',
    theoreticalReadings: [
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Revolução Vertical e Bacharelismo',
        analysis:
          'Em Raízes do Brasil, Sérgio Buarque ressalta que nossas mudanças políticas ocorreram frequentemente de cima para baixo, preservando o estamento patrimonial e o domínio rural sob verniz liberal e bacharelesco.',
      },
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Patriciado Político e Continuidade Colonial',
        analysis:
          'Para Darcy Ribeiro, a Independência transferiu o comando do "patriciado" burocrático para a Corte do Rio de Janeiro sem romper o pacto do latifúndio escravista nem incorporar o povo à cidadania.',
      },
    ],
    presentDayBridge: {
      headline: 'Pactos pelo alto e centralização fiscal',
      summary:
        'A tradição de transições políticas negociadas entre elites para evitar rupturas sociais profundas reaparece em momentos-chave da República e na concentração de recursos na União.',
      indicators: [
        'Preservação da unidade territorial continental de língua portuguesa na América do Sul',
        'Histórico de reformas institucionais pactuadas sem redistribuição estrutural da propriedade',
      ],
    },
    relatedEventIds: [
      'colonia-cunhadismo-sao-vicente-1532',
      'imperio-cabanagem-1835',
      'imperio-farroupilha-1835',
    ],
    darcyBrasilId: 'caipira',
  },
  {
    id: 'imperio-cabanagem-1835',
    title: 'Cabanagem e a Insurreição Popular Amazônica',
    shortTitle: 'Cabanagem (1835)',
    year: 1835,
    yearLabel: '1835–1840',
    era: 'imperio',
    dimensions: ['politica', 'cultura'],
    symbol: 'politica',
    locationName: 'Belém e Baixo Amazonas',
    stateCodes: ['PA', 'AM'],
    coordinates: [-48.49, -1.46],
    summary:
      'Indígenas, caboclos, negros e trabalhadores ribeirinhos tomam o governo da província do Grão-Pará na mais radical revolta popular do Império, reprimida com extrema violência pelas forças regenciais.',
    historicalContext:
      'Marginalizado pela Corte do Rio de Janeiro após a Independência e submetido ao trabalho compulsório e à miséria, o Grão-Pará mergulhou na Cabanagem entre 1835 e 1840. Liderada por figuras como Félix Malcher, Francisco Vinagre e Eduardo Angelim, a insurreição chegou a controlar Belém e extensas áreas do Amazonas. A reconquista imperial deixou cerca de 30 mil mortos — parcela expressiva da população provincial —, consolidando a subordinação amazônica ao Império.',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Insurgência do Brasil Caboclo',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro destaca a Cabanagem como o momento raro em que a massa cabocla e indígena amazônica tomou o poder provincial contra a elite mercantil e burocrática, sofrendo repressão exemplar para manter a ordem imperial.',
      },
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Exclusão Popular no Estado Imperial',
        analysis:
          'A brutalidade com que o Estado regencial sufocou a participação popular revela a impermeabilidade das instituições patrimoniais às demandas vindas de baixo.',
      },
    ],
    presentDayBridge: {
      headline: 'Assimetria regional e protagonismo amazônico',
      summary:
        'A memória da Cabanagem simboliza a longa luta das populações amazônicas por representação política efetiva e por um modelo de desenvolvimento que não as trate como periferia extrativa.',
      indicators: [
        'Debate contemporâneo sobre justiça climática e financiamento direto às populações ribeirinhas e indígenas',
        'Persistência de disparidades de infraestrutura entre a Região Norte e o Centro-Sul',
      ],
    },
    relatedEventIds: [
      'colonia-tratado-madri-1750',
      'imperio-ciclo-borracha-1879',
      'republica-chico-mendes-1988',
    ],
    darcyBrasilId: 'caboclo',
  },
  {
    id: 'imperio-farroupilha-1835',
    title: 'Revolução Farroupilha e a Fronteira Gaúcha',
    shortTitle: 'Farroupilha (1835)',
    year: 1835,
    yearLabel: '1835–1845',
    era: 'imperio',
    dimensions: ['politica', 'economia'],
    symbol: 'pecuaria',
    locationName: 'Piratini e Campanha Gaúcha',
    stateCodes: ['RS'],
    coordinates: [-53.1, -31.45],
    summary:
      'Estancieiros e charqueadores da fronteira meridional proclamam a República Rio-Grandense contra a carga fiscal imperial, em uma guerra de dez anos marcada pela participação decisiva dos Lanceiros Negros.',
    historicalContext:
      'Na campanha gaúcha, forjada sobre as Vacarias del Mar e as estâncias de gado, os produtores de charque ressentiam-se dos impostos imperiais que favoreciam o charque platino. Entre 1835 e 1845, os farrapos sustentaram uma república autônoma no Rio Grande do Sul e em Santa Catarina (República Juliana). O desfecho negociado na Paz de Ponche Verde reintegrou as elites sul-rio-grandenses ao Império, mas traiu a promessa de liberdade plena aos escravizados que combateram como Lanceiros Negros, massacrados em Porongos (1844).',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Complexo Gaúcho dos Brasis Sulinos',
        analysis:
          'Darcy Ribeiro analisa a campanha gaúcha como uma formação pastoril-militar de fronteira, onde a mobilidade do peão e a autonomia dos estancieiros produziram uma identidade regional singular dentro da unidade nacional.',
      },
      {
        lensId: 'homem_cordial',
        author: 'sergio_buarque',
        conceptLabel: 'Caudilhismo e Lealdades Pessoais',
        analysis:
          'As redes de fidelidade pessoal entre estancieiros e peões na fronteira meridional dialogam com a leitura de Sérgio Buarque sobre o predomínio dos laços pessoais e patriarcais sobre normas impessoais.',
      },
    ],
    presentDayBridge: {
      headline: 'Federalismo, pacto federativo e memória afro-gaúcha',
      summary:
        'A experiência farroupilha alimentou o ideário federalista brasileiro, enquanto a revisão histórica recente resgata o papel central dos Lanceiros Negros na formação do Rio Grande do Sul.',
      indicators: [
        'Tensões recorrentes do pacto federativo entre arrecadação regional e transferências da União',
        'Reconhecimento crescente da presença negra e indígena na história oficial sul-rio-grandense',
      ],
    },
    relatedEventIds: [
      'colonia-tratado-madri-1750',
      'imperio-imigracao-sulina-1875',
      'republica-contestado-1912',
    ],
    darcyBrasilId: 'sulino',
  },
  {
    id: 'imperio-lei-de-terras-1850',
    title: 'Fim do Tráfico Atlântico e a Lei de Terras',
    shortTitle: 'Lei de Terras (1850)',
    year: 1850,
    yearLabel: '1850',
    era: 'imperio',
    dimensions: ['economia', 'politica'],
    symbol: 'cafe',
    locationName: 'Campinas e Oeste Paulista',
    stateCodes: ['SP', 'RJ'],
    coordinates: [-47.06, -22.91],
    summary:
      'No mesmo ano em que a Lei Eusébio de Queirós proíbe o tráfico atlântico de escravizados, a Lei de Terras determina que o acesso às terras públicas só ocorra por compra, bloqueando o acesso fundiário a libertos, camponeses e imigrantes pobres.',
    historicalContext:
      'À medida que a marcha do café avançava do Vale do Paraíba para o Oeste Paulista, tornava-se evidente que a escravidão entraria em crise após o fim do tráfico (1850). Antecipando a transição ao trabalho livre, o Parlamento imperial aprovou a Lei de Terras (Lei nº 601/1850), convertendo a terra em mercadoria de alto custo e garantindo que trabalhadores livres — nacionais ou colonos estrangeiros — continuassem disponíveis como mão de obra barata nas grandes fazendas.',
    theoreticalReadings: [
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Estado a Serviço da Grande Lavoura',
        analysis:
          'A legislação de 1850 exemplifica o Estado patrimonial analisado em Raízes do Brasil: as leis modernas de propriedade foram moldadas para preservar o monopólio fundiário da aristocracia cafeeira durante a transição ao capitalismo.',
      },
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Bloqueio Fundiário e Brasil Caipira',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro aponta a Lei de Terras de 1850 como o dispositivo decisivo que impediu a formação de um campesinato livre no Brasil Caipira e empurrou a população rural pobre para a dependência das fazendas ou para a periferia urbana.',
      },
    ],
    presentDayBridge: {
      headline: 'Origem jurídica da questão agrária e da crise habitacional',
      summary:
        'Ao mercantilizar o solo e cercar terras devolutas antes da abolição, 1850 estruturou tanto os conflitos pela reforma agrária no campo quanto a irregularidade fundiária nas favelas e periferias urbanas.',
      indicators: [
        'Persistência de conflitos fundiários e grilagem sobre terras públicas na fronteira agrícola',
        'Déficit habitacional urbano concentrado nas faixas de baixa renda historicamente excluídas da propriedade',
      ],
    },
    relatedEventIds: [
      'imperio-abolicao-1888',
      'imperio-imigracao-sulina-1875',
      'republica-contestado-1912',
    ],
    darcyBrasilId: 'caipira',
    territorialSnapshotId: 'imperio_1850',
  },
  {
    id: 'imperio-imigracao-sulina-1875',
    title: 'Colônias Imigrantes e os Brasis Sulinos',
    shortTitle: 'Imigração Sulina',
    year: 1875,
    yearLabel: '1824–1890',
    era: 'imperio',
    dimensions: ['cultura', 'economia'],
    symbol: 'cultura',
    locationName: 'Caxias do Sul, Serra Gaúcha e Vale do Itajaí',
    stateCodes: ['RS', 'SC', 'PR'],
    coordinates: [-51.18, -29.17],
    summary:
      'Políticas de colonização europeia implantam núcleos de pequena propriedade familiar alemã, italiana, polonesa e, mais tarde, japonesa no Sul do país, transformando a demografia, a agricultura e a base industrial regional.',
    historicalContext:
      'Iniciada com colonos alemães em São Leopoldo (1824) e intensificada a partir de 1875 com a chegada em massa de italianos à Serra Gaúcha e de eslavos ao Paraná e Santa Catarina, a imigração meridional diferiu do colonato paulista: em áreas de mata consideradas "vazias" (na realidade habitadas por povos Kaingang, Xokleng e caboclos), o Estado demarcou lotes familiares policultores que impulsionaram oficinas artesanais, cooperativas e cidades médias.',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Os "Gringos" nos Brasis Sulinos',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro descreve os núcleos de imigrantes europeus ("gringos") como a terceira vertente dos Brasis Sulinos, destacando como o acesso à pequena propriedade gerou maior mobilidade social e industrialização artesanal-fabril, ainda que em tensão com as populações indígenas e caboclas desalojadas.',
      },
      {
        lensId: 'aventureiro_trabalhador',
        author: 'sergio_buarque',
        conceptLabel: 'Ética do Trabalhador e Rotina Produtiva',
        analysis:
          'O contraste entre o latifúndio monocultor e a pequena propriedade policultora ilustra a distinção de Raízes do Brasil entre a aventura extrativa e a disciplina metódica do trabalhador orientada à acumulação gradual.',
      },
    ],
    presentDayBridge: {
      headline: 'Cooperativismo sulino e revisão das políticas de branqueamento',
      summary:
        'As antigas colônias tornaram-se polos de cooperativismo agrícola e indústria de pequeno e médio porte, enquanto a historiografia contemporânea evidencia o caráter desigual de políticas imigratórias que privilegiaram europeus em detrimento dos libertos.',
      indicators: [
        'Região Sul concentra alguns dos maiores sistemas cooperativos agroindustriais do Brasil',
        'Contraste histórico entre acesso à terra concedido a colonos imigrantes e negado à população negra pós-1888',
      ],
    },
    relatedEventIds: [
      'imperio-farroupilha-1835',
      'imperio-lei-de-terras-1850',
      'republica-contestado-1912',
    ],
    darcyBrasilId: 'sulino',
  },
  {
    id: 'imperio-ciclo-borracha-1879',
    title: 'Ciclo da Borracha e a Migração Nordestina para a Amazônia',
    shortTitle: 'Ciclo da Borracha',
    year: 1879,
    yearLabel: '1879–1912',
    era: 'imperio',
    dimensions: ['economia', 'cultura'],
    symbol: 'embarcacao',
    locationName: 'Manaus, Belém e Seringais do Acre',
    stateCodes: ['AM', 'AC', 'RO', 'CE'],
    coordinates: [-60.02, -3.12],
    summary:
      'A demanda industrial mundial por látex amazônico transforma Manaus e Belém em vitrines da Belle Époque enquanto cerca de meio milhão de migrantes nordestinos são lançados ao regime de servidão por dívida nos seringais.',
    historicalContext:
      'Impulsionado pela vulcanização e pela indústria automobilística, o látex da seringueira tornou-se o segundo produto da pauta exportadora brasileira. Coincidindo com a Grande Seca de 1877–1879 no Nordeste, o ciclo atraiu centenas de milhares de sertanejos — sobretudo cearenses — para a Amazônia. Submetidos ao sistema de aviamento (barracão e regatão), os seringueiros consolidaram a presença brasileira no Acre (incorporado em 1903), mas sofreram colapso abrupto após a concorrência da borracha asiática.',
    theoreticalReadings: [
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Seringal, Barracão e Proletariado Externo',
        analysis:
          'Darcy Ribeiro retrata o ciclo da borracha como um novo "moinho de gastar gente" no Brasil Caboclo: a floresta foi integrada ao mercado mundial pelo aviamento, consumindo vidas nordestinas e indígenas sem deixar infraestrutura produtiva duradoura.',
      },
      {
        lensId: 'aventureiro_trabalhador',
        author: 'sergio_buarque',
        conceptLabel: 'Riqueza Súbita e Efemeridade Extrativa',
        analysis:
          'Os teatros luxuosos de Manaus e Belém erguidos sobre um extrativismo vulnerável espelham a lógica aventureira de Raízes do Brasil: esplendor imediato seguido de estagnação quando o mercado externo muda.',
      },
    ],
    presentDayBridge: {
      headline: 'Bioeconomia amazônica e herança dos seringueiros',
      summary:
        'A fusão entre migrantes nordestinos e populações ribeirinhas moldou a identidade do Acre e do Amazonas contemporâneos, servindo de base para o movimento das Reservas Extrativistas e para a bioeconomia florestal.',
      indicators: [
        'Incorporação definitiva do Acre ao território brasileiro pelo Tratado de Petrópolis (1903)',
        'Comunidades extrativistas como guardiãs de cadeias sustentáveis da borracha, castanha e açaí',
      ],
    },
    relatedEventIds: [
      'imperio-cabanagem-1835',
      'republica-chico-mendes-1988',
      'colonia-tratado-madri-1750',
    ],
    darcyBrasilId: 'caboclo',
  },
  {
    id: 'imperio-abolicao-mossoro-1883',
    title: 'Abolição da Escravidão em Mossoró',
    shortTitle: 'Abolição em Mossoró (1883)',
    year: 1883,
    yearLabel: '1883',
    era: 'imperio',
    dimensions: ['politica', 'cultura'],
    symbol: 'politica',
    locationName: 'Mossoró (Rio Grande do Norte)',
    stateCodes: ['RN'],
    coordinates: [-37.3441, -5.1875],
    summary:
      'Em 30 de setembro de 1883 — quase cinco anos antes da Lei Áurea —, a mobilização cívica liderada pela Sociedade Libertadora Mossoroense decreta a extinção total da escravidão no município, convertendo Mossoró em símbolo do abolicionismo popular nordestino.',
    historicalContext:
      'Articulada à vanguarda abolicionista que sacudiu o Nordeste setentrional no início da década de 1880 — ao lado de Redenção (então Acarape), no Ceará, no mesmo ano de 1883 —, a campanha em Mossoró combinou arrecadação popular, pressão pública sobre senhores, fugas e a atuação da Sociedade Libertadora Mossoroense e da imprensa local (O Mossoroense). Em 30 de setembro de 1883, a cidade proclamou a libertação integral de seus escravizados, antecipando-se em quase cinco anos ao Estado imperial e firmando-se como marco pioneiro no Rio Grande do Norte.',
    theoreticalReadings: [
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Esfera Cívica Local Contra o Imobilismo Patrimonial',
        analysis:
          'À luz de Raízes do Brasil, a abolição municipal em Mossoró contrasta com a lógica das reformas verticais conduzidas pelo Estado imperial: diante da resistência escravocrata das oligarquias agrárias nacionais, associações civis e jornais locais anteciparam uma ruptura ética construída a partir da sociedade civil.',
      },
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Fissuras na Empresa Escravista no Nordeste Setentrional',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro mostra que o regime escravista operou com intensidades distintas entre os Brasis: na economia sertanejo-salineira e comercial do Oeste potiguar, menos atrelada ao engenho e à grande lavoura cafeeira, a mobilização popular conseguiu desmontar mais cedo o "moinho de gastar gente" antes de sua derrocada nacional em 1888.',
      },
    ],
    presentDayBridge: {
      headline: 'Memória cívica potiguar e cidadania antirracista nos municípios',
      summary:
        'O 30 de setembro permanece vivo na identidade cívica de Mossoró e do Rio Grande do Norte como prova de que conquistas democráticas podem nascer da organização local, lembrando ainda que a liberdade jurídica de 1883 e 1888 exige continuidade em políticas concretas de igualdade racial e educação.',
      indicators: [
        'Celebração anual do 30 de setembro em Mossoró (Festa da Liberdade) como referência de memória abolicionista no Nordeste',
        'Valorização das histórias regionais negras e da participação cidadã municipal na agenda contemporânea de direitos humanos',
      ],
    },
    relatedEventIds: [
      'imperio-abolicao-1888',
      'imperio-lei-de-terras-1850',
      'colonia-palmares-1597',
    ],
    darcyBrasilId: 'crioulo',
    territorialSnapshotId: 'imperio_1850',
  },
  {
    id: 'imperio-abolicao-1888',
    title: 'Abolição Tardia e a Exclusão Pós-Escravidão',
    shortTitle: 'Abolição (1888)',
    year: 1888,
    yearLabel: '1888',
    era: 'imperio',
    dimensions: ['politica', 'economia', 'cultura'],
    symbol: 'politica',
    locationName: 'Recife, Salvador e Rio de Janeiro',
    stateCodes: ['PE', 'BA', 'RJ'],
    coordinates: [-34.88, -8.05],
    summary:
      'Último país das Américas a extinguir formalmente a escravidão, o Brasil promulga a Lei Áurea após intensa mobilização abolicionista e fugas coletivas, mas sem reforma agrária, indenização ou acesso à educação para os libertos.',
    historicalContext:
      'A abolição de 13 de maio de 1888 resultou de décadas de resistência negra — quilombos, greves, compras de alforria, clubes abolicionistas liderados por figuras como Luís Gama, José do Patrocínio, André Rebouças e Dragão do Mar no Ceará (1884). Contudo, o Estado imperial encerrou o cativeiro sem qualquer política de integração econômica ou educacional, deixando a população negra em desvantagem estrutural nas cidades e no campo.',
    theoreticalReadings: [
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Abolição sem Terra nem Escola e Preconceito de Marca',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro demonstra que a abolição inconclusa — combinada à Lei de Terras e ao preconceito de cor/marca — desmonta o mito da democracia racial e explica a origem das favelas e do "losango social" excludente.',
      },
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Ruptura Institucional Incompleta',
        analysis:
          'A queda da monarquia logo após 1888 confirmou a análise de Raízes do Brasil sobre o fim do patriciado rural imperial: a forma de governo mudou, mas os hábitos hierárquicos herdados da escravidão permaneceram entranhados na vida social.',
      },
    ],
    presentDayBridge: {
      headline: 'Racismo estrutural e políticas de ação afirmativa',
      summary:
        'A ausência de políticas reparatórias em 1888 ecoa diretamente nos indicadores contemporâneos de renda, escolaridade, moradia e violência, motivando o debate sobre cotas raciais e igualdade de oportunidades.',
      indicators: [
        'População preta e parda representa a maioria demográfica brasileira (mais de 55% segundo o IBGE)',
        'Políticas de cotas no ensino superior e no serviço público ampliando o acesso histórico bloqueado após 1888',
      ],
    },
    relatedEventIds: [
      'colonia-engenho-acucar-1549',
      'colonia-palmares-1597',
      'imperio-lei-de-terras-1850',
      'imperio-abolicao-mossoro-1883',
      'republica-constituicao-1988',
    ],
    darcyBrasilId: 'crioulo',
  },

  // =========================================================================
  // BRASIL REPÚBLICA (7 marcos: 1897–1988)
  // =========================================================================
  {
    id: 'republica-canudos-1897',
    title: 'Canudos, Messianismo e o Brasil Sertanejo',
    shortTitle: 'Canudos (1897)',
    year: 1897,
    yearLabel: '1896–1897',
    era: 'republica',
    dimensions: ['politica', 'cultura'],
    symbol: 'politica',
    locationName: 'Canudos (Sertão da Bahia)',
    stateCodes: ['BA'],
    coordinates: [-39.03, -9.9],
    summary:
      'A destruição do arraial de Belo Monte pelo Exército republicano expõe o abismo brutal entre a República oligárquica litorânea e a população pobre, mestiça e sem terra do sertão nordestino.',
    historicalContext:
      'Instalada em 1889 sem participação popular, a Primeira República consolidou o coronelismo e o poder das oligarquias estaduais. No sertão baiano, cerca de 25 mil camponeses, ex-escravizados e indígenas reuniram-se em torno de Antônio Conselheiro em Canudos, construindo uma comunidade autônoma de trabalho coletivo e religiosidade popular. Taxado de foco monarquista pelas elites locais, o arraial resistiu a três expedições militares antes de ser arrasado em outubro de 1897.',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'O Choque Entre o Litoral e o Brasil Sertanejo',
        analysis:
          'Para Darcy Ribeiro, Canudos revela a autonomia espiritual e comunitária do Brasil Sertanejo diante de um Estado republicano exógeno que, incapaz de compreender os pobres do interior, respondeu à busca por terra e dignidade com o massacre.',
      },
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Coronelismo e República Oligárquica',
        analysis:
          'Sob a perspectiva de Raízes do Brasil, a Primeira República adaptou o velho patriarcalismo rural ao federalismo: os coronéis locais converteram o Estado republicano em instrumento privado de controle eleitoral e fundiário.',
      },
    ],
    presentDayBridge: {
      headline: 'Desigualdade regional e memória dos povos do sertão',
      summary:
        'O episódio narrado por Euclides da Cunha e revisitado pela sociologia brasileira segue como advertência contra projetos modernizadores que ignoram ou criminalizam as populações periféricas.',
      indicators: [
        'Superação gradual da "indústria da seca" por políticas de segurança alimentar e convivência com o semiárido',
        'Parque Estadual de Canudos preservando a memória social do arraial de Belo Monte',
      ],
    },
    relatedEventIds: [
      'colonia-currais-sao-francisco-1650',
      'republica-contestado-1912',
      'republica-brasilia-1960',
    ],
    darcyBrasilId: 'sertanejo',
    territorialSnapshotId: 'republica_1889',
  },
  {
    id: 'republica-contestado-1912',
    title: 'Guerra do Contestado e a Questão Agrária Sulina',
    shortTitle: 'Contestado (1912)',
    year: 1912,
    yearLabel: '1912–1916',
    era: 'republica',
    dimensions: ['politica', 'economia'],
    symbol: 'politica',
    locationName: 'Caçador e Planalto Catarinense',
    stateCodes: ['SC', 'PR'],
    coordinates: [-51.01, -26.78],
    summary:
      'Posseiros caboclos expulsos de suas terras pela construção da ferrovia São Paulo–Rio Grande e por madeireiras estrangeiras organizam redutos comunitários e enfrentam tropas federais no maior conflito agrário do Sul.',
    historicalContext:
      'Em uma faixa disputada entre Paraná e Santa Catarina, a concessão estatal de extensas áreas florestais ao sindicato ferroviário norte-americano Brazil Railway Company e à madeireira Southern Brazil Lumber despojou milhares de famílias de posseiros e ex-trabalhadores da ferrovia. Reunidos em torno da memória do monge José Maria, os "pelados" formaram comunidades igualitárias ("Cidades Santas") que resistiram por quatro anos ao cerco militar e ao primeiro uso de aviação em combate no Brasil.',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Os "Matutos" Despojados nos Brasis Sulinos',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro destaca o Contestado como a tragédia dos "matutos" — a população cabocla e açoriana pobre do Sul — esmagada pela aliança entre capital estrangeiro, coronéis da erva-mate e Estado republicano.',
      },
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Expropriação Fundiária e Capital Exógeno',
        analysis:
          'A expulsão de posseiros para viabilizar concessões ferroviárias e madeireiras estrangeiras atualizou, no início do século XX, a lógica da empresa exportadora que subordina populações locais ao lucro externo.',
      },
    ],
    presentDayBridge: {
      headline: 'Conflitos por terra e memória cabocla no Sul',
      summary:
        'A região do Contestado permanece marcada por índices socioeconômicos inferiores à média litorânea sulina e por movimentos sociais rurais que reivindicam acesso à terra e valorização da identidade cabocla.',
      indicators: [
        'Definição definitiva dos limites entre Paraná e Santa Catarina no acordo de 1916',
        'Atuação histórica de movimentos de trabalhadores rurais e agricultura familiar no Oeste catarinense',
      ],
    },
    relatedEventIds: [
      'imperio-lei-de-terras-1850',
      'imperio-imigracao-sulina-1875',
      'republica-canudos-1897',
    ],
    darcyBrasilId: 'sulino',
  },
  {
    id: 'republica-semana-22-1922',
    title: 'Semana de Arte Moderna e a Redescoberta do Brasil',
    shortTitle: 'Semana de 1922',
    year: 1922,
    yearLabel: '1922',
    era: 'republica',
    dimensions: ['cultura'],
    symbol: 'cultura',
    locationName: 'São Paulo (Teatro Municipal)',
    stateCodes: ['SP'],
    coordinates: [-46.63, -23.55],
    summary:
      'Artistas, escritores e músicos rompem com o academicismo europeizante no centenário da Independência, abrindo o ciclo intelectual que reinterpretará a formação brasileira nas décadas seguintes.',
    historicalContext:
      'Realizada em fevereiro de 1922 em uma São Paulo em rápida transformação industrial e imigrante, a Semana de Arte Moderna reuniu nomes como Mário de Andrade, Oswald de Andrade, Anita Malfatti, Tarsila do Amaral e Heitor Villa-Lobos. Ao propor a valorização da língua falada, das raízes indígenas e afro-brasileiras e da estética antropofágica, o modernismo pavimentou o terreno crítico em que surgiriam clássicos interpretativos dos anos 1930, como Raízes do Brasil (1936).',
    theoreticalReadings: [
      {
        lensId: 'homem_cordial',
        author: 'sergio_buarque',
        conceptLabel: 'Crítica ao Bacharelismo e Descoberta das Raízes',
        analysis:
          'Ligado inicialmente ao ambiente modernista, Sérgio Buarque superou o ufanismo estético em Raízes do Brasil para investigar criticamente as raízes ibéricas, a cordialidade e o descompasso entre instituições importadas e realidade social.',
      },
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Autoconsciência do Povo Novo',
        analysis:
          'A virada cultural dos anos 1920 e 1930 expressa o despertar da autoconsciência nacional: o Brasil deixa de se ver apenas como cópia imperfeita da Europa para reconhecer a originalidade de sua síntese étnica e cultural.',
      },
    ],
    presentDayBridge: {
      headline: 'Pluralidade estética e descentralização cultural',
      summary:
        'A releitura contemporânea do centenário de 1922 amplia o cânone modernista para reconhecer protagonismos negros, indígenas, nordestinos e periféricos na invenção da cultura brasileira.',
      indicators: [
        'Consolidação internacional da literatura, música, arquitetura e artes visuais brasileiras',
        'Movimentos culturais contemporâneos expandindo a ideia de brasilidade para além do eixo Rio–São Paulo',
      ],
    },
    relatedEventIds: [
      'colonia-matriz-tupi-1500',
      'republica-industrializacao-vargas-1941',
      'republica-constituicao-1988',
    ],
    darcyBrasilId: 'caipira',
  },
  {
    id: 'republica-industrializacao-vargas-1941',
    title: 'Era Vargas, CSN e a Industrialização Estatal',
    shortTitle: 'CSN e Era Vargas',
    year: 1941,
    yearLabel: '1930–1945',
    era: 'republica',
    dimensions: ['economia', 'politica'],
    symbol: 'industria',
    locationName: 'Volta Redonda e Eixo Rio–São Paulo–Minas',
    stateCodes: ['RJ', 'SP', 'MG'],
    coordinates: [-44.1, -22.52],
    summary:
      'A criação da Companhia Siderúrgica Nacional (1941), da Vale do Rio Doce (1942) e da CLT (1943) marca a passagem do Brasil agrário-exportador para uma economia urbano-industrial conduzida pelo Estado.',
    historicalContext:
      'A Revolução de 1930 encerrou a hegemonia exclusiva das oligarquias cafeeiras e inaugurou um Estado nacional centralizador. Entre direitos trabalhistas urbanos (excluindo inicialmente o campo), empresas estatais de base como a CSN em Volta Redonda e o autoritarismo do Estado Novo (1937–1945), iniciou-se o processo de substituição de importações e o êxodo rural acelerado que inverteria a demografia brasileira entre 1940 e 1980.',
    theoreticalReadings: [
      {
        lensId: 'moinho_de_gastar_gente',
        author: 'darcy_ribeiro',
        conceptLabel: 'Industrialização e Urbanização Caótica',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro destaca a CSN e a Vale do Rio Doce como marcos do esforço de industrialização nacional, mas alerta que a modernização sem reforma agrária produziu uma urbanização caótica e massas marginais nas metrópoles.',
      },
      {
        lensId: 'patrimonialismo',
        author: 'sergio_buarque',
        conceptLabel: 'Estado Tutor e Modernização pelo Alto',
        analysis:
          'A legislação trabalhista outorgada e o corporativismo sindical sob o Estado Novo dialogam com a leitura de Sérgio Buarque sobre a centralidade do Estado patrimonial na condução de mudanças sociais sem autonomia plena da sociedade civil.',
      },
    ],
    presentDayBridge: {
      headline: 'Desindustrialização, direitos trabalhistas e metrópoles',
      summary:
        'A base industrial erguida a partir dos anos 1940 transformou o Brasil em sociedade majoritariamente urbana, mas hoje enfrenta o desafio da reindustrialização sustentável e da proteção social diante da informalidade.',
      indicators: [
        'População urbana saltou de cerca de 31% em 1940 para mais de 85% no século XXI',
        'Debate permanente sobre produtividade industrial, transição energética e regulação do trabalho',
      ],
    },
    relatedEventIds: [
      'republica-semana-22-1922',
      'republica-brasilia-1960',
      'republica-constituicao-1988',
    ],
    darcyBrasilId: 'caipira',
  },
  {
    id: 'republica-brasilia-1960',
    title: 'Brasília, Desenvolvimentismo e a Marcha para o Cerrado',
    shortTitle: 'Brasília (1960)',
    year: 1960,
    yearLabel: '1956–1960',
    era: 'republica',
    dimensions: ['politica', 'economia', 'cultura'],
    symbol: 'urbanizacao',
    locationName: 'Brasília e Planalto Central',
    stateCodes: ['DF', 'GO', 'MT', 'TO'],
    coordinates: [-47.88, -15.79],
    summary:
      'Erguida em menos de quatro anos no coração do Cerrado por dezenas de milhares de trabalhadores candangos, Brasília simboliza o auge do desenvolvimentismo e reorienta a malha rodoviária e a fronteira agrícola para o interior.',
    historicalContext:
      'Projeto-síntese do Plano de Metas de Juscelino Kubitschek, com urbanismo de Lúcio Costa e arquitetura de Oscar Niemeyer, a nova capital federal interiorizou a sede do Estado brasileiro, abrindo eixos rodoviários como a Belém–Brasília. Ao mesmo tempo, a industrialização substitutiva concentrou-se ainda mais em São Paulo, enquanto a ocupação acelerada do Planalto Central preparou a expansão da fronteira agropecuária sobre o Cerrado nas décadas seguintes.',
    theoreticalReadings: [
      {
        lensId: 'aventureiro_trabalhador',
        author: 'sergio_buarque',
        conceptLabel: 'Contraste Entre Cidade Planejada e Expansão Espontânea',
        analysis:
          'O Plano Piloto geométrico parece inverter a tradição do "semeador" descrita em Raízes do Brasil, mas a rápida formação das cidades-satélites ao redor do centro planejado expôs a persistência da desigualdade socioespacial brasileira.',
      },
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Candangos, Interiorização e Novo Centro-Oeste',
        analysis:
          'Em O Povo Brasileiro, Darcy Ribeiro associa a construção de Brasília e o ciclo desenvolvimentista à grande migração sertaneja e à abertura definitiva do Cerrado, reconfigurando o equilíbrio territorial entre litoral e interior.',
      },
    ],
    presentDayBridge: {
      headline: 'Fronteira do Cerrado e planejamento urbano inclusivo',
      summary:
        'A interiorização impulsionada por Brasília consolidou o Centro-Oeste como potência agroexportadora global, mas impôs forte pressão ecológica sobre o bioma Cerrado — o "berço das águas" do país.',
      indicators: [
        'Região Centro-Oeste responde por grande parcela da produção brasileira de grãos e proteína animal',
        'Mais da metade da vegetação nativa do Cerrado já convertida, exigindo políticas urgentes de conservação',
      ],
    },
    relatedEventIds: [
      'republica-industrializacao-vargas-1941',
      'republica-canudos-1897',
      'republica-chico-mendes-1988',
    ],
    darcyBrasilId: 'sertanejo',
  },
  {
    id: 'republica-chico-mendes-1988',
    title: 'Chico Mendes, Povos da Floresta e a Fronteira Amazônica',
    shortTitle: 'Povos da Floresta',
    year: 1988,
    yearLabel: '1970–1988',
    era: 'republica',
    dimensions: ['cultura', 'politica', 'economia'],
    symbol: 'aldeia',
    locationName: 'Xapuri (Acre) e Fronteira Amazônica',
    stateCodes: ['AC', 'AM', 'RO', 'PA'],
    coordinates: [-68.5, -10.65],
    summary:
      'Diante do avanço de rodovias, desmatamento e grilagem na Amazônia, seringueiros e povos indígenas forjam a Aliança dos Povos da Floresta sob liderança de Chico Mendes, criando o conceito de Reservas Extrativistas.',
    historicalContext:
      'A partir dos anos 1970, projetos de colonização, incentivos fiscais e grandes obras abriram uma frente predatória sobre a Amazônia, ameaçando tanto povos indígenas quanto comunidades extrativistas. No Acre, seringueiros organizaram "empates" pacíficos para impedir a derrubada da floresta e propuseram as Reservas Extrativistas (RESEX), combinando reforma agrária e conservação ambiental. O assassinato de Chico Mendes em dezembro de 1988 projetou internacionalmente a causa socioambiental amazônica.',
    theoreticalReadings: [
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Defesa Contemporânea do Brasil Caboclo',
        analysis:
          'Darcy Ribeiro encerra sua leitura do Brasil Caboclo destacando Chico Mendes e os povos da floresta como protagonistas de uma alternativa civilizatória capaz de conciliar vida digna na Amazônia com a preservação da mata em pé.',
      },
      {
        lensId: 'aventureiro_trabalhador',
        author: 'sergio_buarque',
        conceptLabel: 'Superação da Fronteira Predatória',
        analysis:
          'O embate entre a grilagem extrativa de curto prazo e o manejo comunitário de longo prazo atualiza, na fronteira amazônica, a tensão clássica de Raízes do Brasil entre a pilhagem aventureira e o cuidado construtivo.',
      },
    ],
    presentDayBridge: {
      headline: 'Amazônia no centro da crise climática mundial',
      summary:
        'As Reservas Extrativistas e as Terras Indígenas consolidadas após 1988 formam hoje o principal escudo contra o ponto de não retorno ecológico da Amazônia e inspiram modelos globais de sociobioeconomia.',
      indicators: [
        'Mais de 90 Reservas Extrativistas federais e estaduais instituídas no Brasil desde 1990',
        'Protagonismo brasileiro nas negociações climáticas internacionais vinculadas à floresta em pé',
      ],
    },
    relatedEventIds: [
      'colonia-matriz-tupi-1500',
      'imperio-cabanagem-1835',
      'imperio-ciclo-borracha-1879',
      'republica-constituicao-1988',
    ],
    darcyBrasilId: 'caboclo',
  },
  {
    id: 'republica-constituicao-1988',
    title: 'Redemocratização e a Constituição Cidadã',
    shortTitle: 'Constituição de 1988',
    year: 1988,
    yearLabel: '1988',
    era: 'republica',
    dimensions: ['politica', 'cultura'],
    symbol: 'politica',
    locationName: 'Brasília e Mobilização Nacional',
    stateCodes: ['DF', 'SP', 'RJ', 'MG'],
    coordinates: [-47.93, -15.78],
    summary:
      'Após 21 anos de ditadura militar e amplas mobilizações sociais como as Diretas Já, a Constituição de 1988 universaliza o voto, cria o SUS e reconhece pela primeira vez os direitos originários indígenas, quilombolas e ambientais.',
    historicalContext:
      'Resultado da Assembleia Nacional Constituinte de 1987–1988, atravessada por emendas populares de movimentos sindicais, negros, indígenas, feministas e sanitaristas, a Carta de 1988 estabeleceu o maior ciclo democrático da história brasileira. Introduziu o sufrágio universal pleno (incluindo analfabetos), a criminalização do racismo, o Sistema Único de Saúde (SUS), a proteção ao meio ambiente e o rompimento formal com a tutela assimilacionista sobre os povos indígenas.',
    theoreticalReadings: [
      {
        lensId: 'homem_cordial',
        author: 'sergio_buarque',
        conceptLabel: 'Construção da Esfera Cívica Impessoal',
        analysis:
          'À luz de Raízes do Brasil, a Constituição de 1988 representa o esforço mais ambicioso do país para erguer instituições cívicas impessoais, universais e democráticas acima dos privilégios patrimoniais e das lealdades pessoais.',
      },
      {
        lensId: 'povos_novos',
        author: 'darcy_ribeiro',
        conceptLabel: 'Reconhecimento do Brasil Pluriétnico',
        analysis:
          'Alinhada ao horizonte de O Povo Brasileiro, a Carta de 1988 reconhece a pluralidade de matrizes do país — assegurando terras indígenas, territórios quilombolas e direitos sociais universais como base de um projeto nacional inclusivo.',
      },
    ],
    presentDayBridge: {
      headline: 'Democracia social em disputa permanente',
      summary:
        'A efetivação cotidiana das promessas de 1988 — saúde pública universal, educação de qualidade, igualdade racial, demarcação territorial e defesa das instituições democráticas — define a agenda central do Brasil do século XXI.',
      indicators: [
        'Sistema Único de Saúde (SUS) garantindo acesso universal a mais de 200 milhões de habitantes',
        'Consolidação de eleições diretas periódicas e ampliação histórica da participação eleitoral',
      ],
    },
    relatedEventIds: [
      'imperio-independencia-1822',
      'imperio-abolicao-1888',
      'republica-chico-mendes-1988',
      'republica-industrializacao-vargas-1941',
    ],
    darcyBrasilId: 'caipira',
  },
];
