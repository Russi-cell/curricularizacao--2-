'use strict';

/* =====================================================================
   BRUSQUE KIDS - Jogo educativo (Grupo 16)
   ---------------------------------------------------------------------
   1) PERGUNTAS  -> todas as perguntas do jogo (fácil, médio, difícil)
   2) ESTADO     -> o que está acontecendo agora no jogo
   3) FUNÇÕES    -> áudio, telas, perguntas, feedback e ranking
   ===================================================================== */

/* ---------- 1) PERGUNTAS ---------- */

const NOMES_NIVEL = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
const PERGUNTAS_POR_PARTIDA = 10;

// Atalhos para montar as perguntas mais rápido
const o = (e, t, c = false, svg = '') => ({ e, t, c, svg });                // opção: emoji, texto, é a certa?, imagem (opcional)
const G = (s) => '<div class="emojis">' + s + '</div>';               // emojis grandes
const L = (s) => '<p class="legenda">' + s + '</p>';                  // legenda pequena
const LETRAS = (s) => '<div class="letras">' + s + '</div>';          // letras grandes

/* Bandeiras desenhadas em SVG (aparecem em qualquer aparelho, ao contrário dos emojis de bandeira) */
const BANDEIRAS = {
  br: '<svg viewBox="0 0 70 50"><rect width="70" height="50" fill="#009c3b"/><path d="M35 5 66 25 35 45 4 25Z" fill="#ffdf00"/><circle cx="35" cy="25" r="10" fill="#002776"/><path d="M26 23q9-3 18 3" stroke="#fff" stroke-width="2" fill="none"/></svg>',
  es: '<svg viewBox="0 0 70 50"><rect width="70" height="50" fill="#aa151b"/><rect y="12.5" width="70" height="25" fill="#f1bf00"/></svg>',
  fr: '<svg viewBox="0 0 70 50"><rect width="70" height="50" fill="#fff"/><rect width="23.4" height="50" fill="#0055a4"/><rect x="46.6" width="23.4" height="50" fill="#ef4135"/></svg>'
};

/* Ilustração de Brusque (igreja matriz, casas de enxaimel, rio). Para usar uma imagem sua,
   salve como img/q08.jpg (o jogo troca sozinho, como nas outras perguntas). */
const CENA_BRUSQUE = '<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cidade de Brusque"><defs><linearGradient id="ceuBq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ec6ff"/><stop offset="1" stop-color="#d8f0ff"/></linearGradient></defs><rect width="400" height="200" fill="url(#ceuBq)"/><circle cx="338" cy="38" r="20" fill="#ffe27a"/><ellipse cx="80" cy="40" rx="30" ry="9" fill="#fff" opacity=".9"/><ellipse cx="105" cy="34" rx="20" ry="8" fill="#fff" opacity=".9"/><ellipse cx="250" cy="55" rx="26" ry="7" fill="#fff" opacity=".8"/><path d="M0 120 Q60 70 130 110 T260 100 T400 105 V200 H0Z" fill="#5fae5a"/><path d="M0 140 Q90 105 190 135 T400 128 V200 H0Z" fill="#43a047"/><rect x="170" y="78" width="60" height="62" fill="#f4efe4"/><rect x="160" y="62" width="22" height="78" fill="#efe7d6"/><rect x="218" y="62" width="22" height="78" fill="#efe7d6"/><path d="M156 64 171 36 186 64Z" fill="#b5483a"/><path d="M214 64 229 36 244 64Z" fill="#b5483a"/><path d="M170 80 200 56 230 80Z" fill="#c9553f"/><rect x="190" y="104" width="20" height="36" rx="10" fill="#6b4a2f"/><circle cx="200" cy="90" r="5" fill="#6b4a2f"/><rect x="168" y="76" width="6" height="10" rx="3" fill="#6b4a2f"/><rect x="226" y="76" width="6" height="10" rx="3" fill="#6b4a2f"/><g><rect x="40" y="108" width="62" height="40" fill="#fff8ea"/><path d="M34 110 71 80 108 110Z" fill="#c0392b"/><path d="M40 108h62M40 128h62M56 108v40M86 108v40M40 148 56 128M102 148 86 128" stroke="#5b3a24" stroke-width="3" fill="none"/><rect x="62" y="128" width="18" height="20" fill="#7a5233"/></g><g><rect x="290" y="112" width="70" height="38" fill="#fff8ea"/><path d="M283 114 325 82 367 114Z" fill="#b5483a"/><path d="M290 112h70M290 132h70M308 112v38M342 112v38M290 150 308 132M360 150 342 132" stroke="#5b3a24" stroke-width="3" fill="none"/><rect x="316" y="132" width="18" height="18" fill="#7a5233"/></g><g><rect x="112" y="124" width="44" height="26" fill="#fff8ea"/><path d="M107 126 134 104 161 126Z" fill="#d35a3c"/><path d="M112 124h44M112 138h44M134 124v26" stroke="#5b3a24" stroke-width="2.5" fill="none"/></g><g><rect x="244" y="126" width="38" height="24" fill="#fff8ea"/><path d="M239 128 263 108 287 128Z" fill="#c0392b"/><path d="M244 126h38M244 138h38M263 126v24" stroke="#5b3a24" stroke-width="2.5" fill="none"/></g><g fill="#2e7d32"><circle cx="20" cy="140" r="14"/><circle cx="380" cy="142" r="13"/><circle cx="162" cy="146" r="9"/></g><path d="M0 172 Q100 160 200 172 T400 170 V200 H0Z" fill="#4aa8e8"/><path d="M30 184q20-5 40 0M180 180q25-5 50 0M300 186q20-5 45 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/></svg>';

/*
  Campos de cada pergunta:
  nivel       -> 'facil' | 'medio' | 'dificil'
  texto       -> título que aparece na tela
  fala        -> frase que o jogo lê em voz alta
  visual      -> o que aparece na imagem (por enquanto emojis; depois dá para trocar por <img>)
  opcoes      -> alternativas (a certa tem c = true)
  explicacao  -> explica o porquê da resposta
  som         -> (opcional) arquivo de áudio, ex.: 'audio/leao.mp3'
  somReserva  -> (opcional) frase falada caso o arquivo de som não exista
  tipo        -> (opcional) 'associar' para a pergunta de ligar animal e casa
  arrastar    -> (opcional) true = a resposta é dada ARRASTANDO a carta até a imagem (ou tocando nela)
  visualCheio -> (opcional) true = a imagem ocupa toda a área onde se solta a resposta
  manterVisual-> (opcional) true = a imagem de img/ aparece embaixo do visual, sem apagá-lo (ex.: letras)
*/
const PERGUNTAS = [
  /* ---------------- FÁCIL ---------------- */
  {
    id: 'q01', nivel: 'facil', texto: 'Onde está o pássaro?', fala: 'Onde está o passarinho?',
    visual: G('🐦<br>🌉') + L('Ponte Irineu Bornhausen, em Brusque'),
    opcoes: [o('⬆️', 'Em cima', true), o('⬇️', 'Embaixo'), o('↔️', 'Ao lado')],
    explicacao: 'O passarinho está voando em cima da ponte. "Em cima" quer dizer na parte de cima, mais alto.'
  },
  {
    id: 'q02', nivel: 'facil', texto: 'Onde está a bola?', fala: 'Onde está a bola?',
    visual: G('🪑<br>⚽') + L('Praça Barão de Schneeburg, em Brusque'),
    opcoes: [o('⬆️', 'Em cima'), o('⬇️', 'Embaixo', true), o('↩️', 'Atrás')],
    explicacao: 'A bola está embaixo do banco. "Embaixo" quer dizer na parte de baixo, debaixo de alguma coisa.'
  },
  {
    id: 'q03', nivel: 'facil', texto: 'Qual palavra começa com a mesma letra de GATO?',
    fala: 'Gato começa com G. Qual destes animais também começa com G?',
    visual: G('🐱') + LETRAS('G A T O'),
    opcoes: [o('🐶', 'Cachorro'), o('🐔', 'Galinha', true), o('🐟', 'Peixe')],
    explicacao: 'Gato e galinha começam com a mesma letra: o G.'
  },
  {
    id: 'q04', nivel: 'facil', texto: 'Qual palavra começa com a mesma letra de MAÇÃ?',
    fala: 'Qual palavra começa com a mesma letra de maçã?',
    visual: G('🍎') + LETRAS('M A Ç Ã'),
    opcoes: [o('🐵', 'Macaco', true), o('🐱', 'Gato'), o('🐟', 'Peixe')],
    explicacao: 'Maçã e macaco começam com a mesma letra: o M.'
  },
  {
    id: 'q05', nivel: 'facil', texto: 'Quantas capivaras aparecem na imagem?', fala: 'Quantas capivaras aparecem na imagem?',
    visual: G('🦫 &nbsp; 🦫 &nbsp; 🦫 &nbsp; 🦫'),
    opcoes: [o('', '3'), o('', '4', true), o('', '5')],
    explicacao: 'Contando uma por uma: 1, 2, 3, 4. São 4 capivaras!'
  },
  {
    id: 'q06', nivel: 'facil', texto: 'Quantas árvores aparecem na imagem?', fala: 'Quantas árvores aparecem na imagem?',
    visual: G('🌳 🌳 🌳 🌳 🌳'),
    opcoes: [o('', '4'), o('', '5', true), o('', '6')],
    explicacao: 'Contando uma por uma: 1, 2, 3, 4, 5. São 5 árvores!'
  },
  {
    id: 'q07', nivel: 'facil', texto: 'O que podemos ver na imagem?', fala: 'O que podemos ver na imagem?',
    visual: G('🌳 🪑 🧒 🪑 🌳') + L('Uma praça de Brusque'),
    opcoes: [o('🏞️', 'Uma praça', true), o('🏖️', 'Uma praia'), o('🌲', 'Uma floresta')],
    explicacao: 'Com árvores, bancos e pessoas passeando, o lugar é uma praça. Ali a gente brinca e descansa!'
  },
  {
    id: 'q08', nivel: 'facil', texto: 'Em qual país fica Brusque?', fala: 'Em qual país fica Brusque?',
    arrastar: true, visualCheio: true,
    visual: CENA_BRUSQUE,
    opcoes: [o('🇪🇸', 'Espanha', false, BANDEIRAS.es), o('🇧🇷', 'Brasil', true, BANDEIRAS.br), o('🇫🇷', 'França', false, BANDEIRAS.fr)],
    explicacao: 'Brusque fica em Santa Catarina, no Brasil.'
  },
  {
    id: 'q09', nivel: 'facil', arrastar: true, texto: 'Qual animal vive na água?', fala: 'Qual animal vive na água?',
    visual: G('💧'),
    opcoes: [o('🐟', 'Peixe', true), o('🐶', 'Cachorro'), o('🐰', 'Coelho')],
    explicacao: 'O peixe vive na água e respira dentro dela. O cachorro e o coelho vivem na terra.'
  },
  {
    id: 'q10', nivel: 'facil', arrastar: true, texto: 'Leve o pinguim para a casa dele!', fala: 'Leve o pinguim para a casa dele!',
    visual: G('🐧'),
    opcoes: [o('🌲', 'Floresta'), o('🧊', 'Gelo', true), o('🏜️', 'Deserto')],
    explicacao: 'O pinguim mora em lugares bem frios, com muito gelo!'
  },

  /* ---------------- MÉDIO ---------------- */
  {
    id: 'q11', nivel: 'medio', texto: 'De que lado da imagem está a árvore?',
    fala: 'Olhando para a imagem, de que lado está a árvore?',
    visual: G('🌳 &nbsp; 🧒') + L('A criança está no meio da imagem'),
    opcoes: [o('⬅️', 'Esquerda', true), o('➡️', 'Direita'), o('↩️', 'Atrás')],
    explicacao: 'Olhando para a imagem, a árvore está do lado esquerdo.'
  },
  {
    id: 'q12', nivel: 'medio', texto: 'De que lado da imagem está o brinquedo?',
    fala: 'Olhando para a imagem, de que lado está o brinquedo?',
    visual: G('🧒 &nbsp; 🛝') + L('Uma praça de Brusque'),
    opcoes: [o('⬅️', 'Esquerda'), o('➡️', 'Direita', true), o('↩️', 'Atrás')],
    explicacao: 'Olhando para a imagem, o escorregador está do lado direito.'
  },
  {
    id: 'q13', nivel: 'medio', manterVisual: true, texto: 'Qual palavra pode ser formada com estas letras?',
    fala: 'Qual palavra pode ser formada com estas letras?',
    visual: LETRAS('A O B L'),
    opcoes: [o('', 'Gato'), o('', 'Bola', true), o('', 'Casa')],
    explicacao: 'Juntando as letras B, O, L e A, formamos a palavra BOLA.'
  },
  {
    id: 'q14', nivel: 'medio', texto: 'Qual letra está faltando?',
    fala: 'Qual letra está faltando para completar a palavra banana?',
    visual: G('🍌') + LETRAS('B A N _ N A'),
    opcoes: [o('', 'D'), o('', 'L'), o('', 'A', true)],
    explicacao: 'A palavra é BANANA: B, A, N, A, N, A. A letra que faltava era o A.'
  },
  {
    id: 'q15', nivel: 'medio', texto: 'Qual grupo tem mais animais?', fala: 'Qual grupo tem mais animais?',
    visual: L('Grupo 1') + G('🦫 🦫 🦫') + L('Grupo 2') + G('🐦 🐦 🐦 🐦 🐦'),
    opcoes: [o('🦫', 'As capivaras'), o('🐦', 'Os pássaros', true), o('🟰', 'Os dois grupos têm a mesma quantidade')],
    explicacao: 'Há 3 capivaras e 5 pássaros. Como 5 é maior que 3, os pássaros são mais!'
  },
  {
    id: 'q16', nivel: 'medio', texto: 'Qual animal aparece em menor quantidade?', fala: 'Qual animal aparece em menor quantidade?',
    visual: G('🦆 🦆 🦆 🦆') + G('🐟 🐟') + G('🐢 🐢 🐢'),
    opcoes: [o('🦆', 'Os patos'), o('🐟', 'Os peixes', true), o('🐢', 'As tartarugas')],
    explicacao: 'São 4 patos, 2 peixes e 3 tartarugas. O menor número é o 2, então são os peixes.'
  },
  {
    id: 'q17', nivel: 'medio', texto: 'Quem fez esse som?', fala: 'Quem fez esse som?',
    visual: G('🔊 ❓') + L('Toque no botão para ouvir o som'),
    som: 'audio/leao.mp3', somReserva: 'Rooooaaar!',
    opcoes: [o('🐸', 'Sapo'), o('🦁', 'Leão', true), o('🐮', 'Vaca')],
    explicacao: 'Quem ruge desse jeito é o leão! O sapo faz "croac" e a vaca faz "muuu".'
  },
  {
    id: 'q18', nivel: 'medio', texto: 'Quem combina com este lugar?', fala: 'Quem combina com este lugar?',
    visual: G('🏡 🌾 🌳') + L('Uma fazenda'),
    opcoes: [o('🐮', 'Vaca', true), o('🐬', 'Golfinho'), o('🐧', 'Pinguim')],
    explicacao: 'A vaca vive na fazenda, no pasto. O golfinho vive no mar e o pinguim vive no gelo.'
  },

  /* ---------------- DIFÍCIL ---------------- */
  {
    id: 'q19', nivel: 'dificil', texto: 'Onde está a bicicleta?', fala: 'Onde está a bicicleta?',
    visual: G('🚲 &nbsp; 🧒➡️') + L('A criança está olhando para a frente (➡️)'),
    opcoes: [o('⬆️', 'Na frente'), o('↩️', 'Atrás', true), o('⬅️', 'À esquerda')],
    explicacao: 'A criança olha para a frente, e a bicicleta ficou nas costas dela. Por isso está atrás.'
  },
  {
    id: 'q20', nivel: 'dificil', texto: 'Qual caminho devemos seguir?', fala: 'Para onde devemos ir?',
    visual: G('🧒 &nbsp; 🪧➡️ &nbsp; 🏛️') + L('A placa indica o caminho até a Prefeitura de Brusque'),
    opcoes: [o('⬅️', 'Esquerda'), o('➡️', 'Direita', true), o('🔙', 'Voltar')],
    explicacao: 'A placa aponta para a direita, então é por lá que devemos ir para chegar à Prefeitura.'
  },
  {
    id: 'q21', nivel: 'dificil', texto: 'Qual palavra começa com uma letra diferente das outras?',
    fala: 'Qual palavra começa com uma letra diferente das outras?',
    visual: LETRAS('CACHORRO &nbsp; GATO &nbsp; CAVALO'),
    opcoes: [o('', 'Cachorro'), o('', 'Gato', true), o('', 'Cavalo')],
    explicacao: 'Cachorro e cavalo começam com C, mas gato começa com G. Por isso o gato é diferente!'
  },
  {
    id: 'q22', nivel: 'dificil', texto: 'Qual é a ordem correta para formar a palavra da imagem?',
    fala: 'Qual é a ordem correta das letras para formar a palavra borboleta?',
    visual: G('🦋') + LETRAS('B R O B O L E T A'),
    opcoes: [o('', 'Borboleta', true), o('', 'Bobroleta'), o('', 'Bolboreta')],
    explicacao: 'Na ordem certa, as letras formam BORBOLETA: B, O, R, B, O, L, E, T, A.'
  },
  {
    id: 'q23', nivel: 'dificil', texto: 'Quantos animais há ao todo na imagem?', fala: 'Quantos animais há ao todo na imagem?',
    visual: G('🦫 🦫 🦫 &nbsp; 🐦 🐦'),
    opcoes: [o('', '4'), o('', '5', true), o('', '6')],
    explicacao: 'São 3 capivaras e 2 pássaros. Somando, 3 + 2 = 5 animais.'
  },
  {
    id: 'q24', nivel: 'dificil', texto: 'Quantos gatinhos existem, contando os escondidos?',
    fala: 'Quantos gatinhos existem na imagem, contando os que estão parcialmente escondidos?',
    visual: G('🐱 🐱 🐱 🐱 &nbsp;🌳<span class="meio">🐱</span><span class="meio">🐱</span>') + L('Dois gatinhos estão atrás da árvore'),
    opcoes: [o('', '4'), o('', '5'), o('', '6', true)],
    explicacao: 'Aparecem 4 gatinhos inteiros e mais 2 escondidos atrás da árvore. Então 4 + 2 = 6.'
  },
  {
    id: 'q25', nivel: 'dificil', texto: 'O que aparece na imagem?', fala: 'O que aparece na imagem?',
    visual: G('🏞️') + L('O Rio Itajaí-Mirim passando por Brusque'),
    opcoes: [o('🌊', 'Um rio', true), o('🏔️', 'Uma montanha de neve'), o('🏖️', 'O mar')],
    explicacao: 'É um rio! O Rio Itajaí-Mirim passa por Brusque.'
  },
  {
    id: 'q26', nivel: 'dificil', texto: 'Qual festa acontece em Brusque?',
    fala: 'Qual festa acontece em Brusque?',
    visual: G('🦆 🎉'),
    opcoes: [o('🦆', 'Fenarreco', true), o('🎭', 'Carnaval'), o('🌽', 'Festa Junina')],
    explicacao: 'A Fenarreco é uma festa muito conhecida de Brusque e acontece todo ano!'
  },
  {
    id: 'q27', nivel: 'dificil', texto: 'Qual destes elementos podemos encontrar em Brusque?',
    fala: 'Qual destes elementos podemos encontrar em Brusque?',
    visual: G('🌊 🌉 🌳 🏠 🧑'),
    opcoes: [o('🌊', 'Rio', true), o('🌋', 'Vulcão'), o('🏜️', 'Deserto')],
    explicacao: 'Em Brusque tem rio, ponte, árvores e casas. Vulcão e deserto não existem por lá.'
  },
  {
    id: 'q28', nivel: 'dificil', texto: 'Quem fez esse som?', fala: 'Quem fez esse som?',
    visual: G('🔊 ❓') + L('Toque no botão para ouvir o som'),
    som: 'audio/lobo.mp3', somReserva: 'Auuuuuu!',
    opcoes: [o('🦫', 'Capivara'), o('🐶', 'Cachorro'), o('🐺', 'Lobo', true)],
    explicacao: 'Esse uivo é do lobo! O cachorro late e a capivara quase não faz barulho.'
  },
  {
    id: 'q29', nivel: 'dificil', tipo: 'associar', texto: 'Cada bichinho para sua casa!',
    fala: 'Cada bichinho precisa encontrar sua casa! Toque no animal e depois no lugar onde ele vive.',
    visual: G('🐟 🦅 🐵'),
    pares: [
      { animal: '🐟 Peixe', casa: '💧 Água' },
      { animal: '🦅 Águia', casa: '☁️ Céu' },
      { animal: '🐵 Macaco', casa: '🌴 Floresta' }
    ],
    textoCorreto: 'O peixe vive na água, a águia no céu e o macaco na floresta',
    explicacao: 'O peixe vive na água, a águia voa no céu e o macaco mora na floresta.'
  },
  {
    id: 'q30', nivel: 'dificil', arrastar: true, texto: 'Encontre o animal que combina com este lugar!',
    fala: 'Encontre o animal que combina com este lugar!',
    visual: G('🌊🌊🌊') + L('O oceano'),
    som: 'audio/ondas.mp3', somReserva: 'Shhhh, shhhh. São as ondas do mar!',
    opcoes: [o('🐢', 'Tartaruga-marinha', true), o('🦁', 'Leão'), o('🐘', 'Elefante')],
    explicacao: 'A tartaruga-marinha vive no oceano. O leão e o elefante vivem na terra.'
  }
];

/*
  Falas fixas do jogo. Cada uma vira um arquivo audio/<chave>.mp3
  (por exemplo, a chave "ok" é o arquivo audio/ok.mp3).
*/
const FALAS_FIXAS = {
  'nivel': 'Escolha o nível: fácil, médio ou difícil.',
  'ok': 'Muito bem! Você acertou!',
  'erro': 'Ops! Você errou! Não foi dessa vez, mas continue tentando!',
  'fim': 'Fim do jogo! Parabéns!',
  'fim-3': 'Você mostrou que conhece muito bem a cidade de Brusque!',
  'fim-2': 'Você mostrou que sabe bastante. Que tal tentar de novo?',
  'fim-1': 'Continue treinando, você vai conseguir!'
};

/* Monta { arquivo, texto } de uma fala fixa */
const fixa = (chave) => ({ arquivo: 'audio/' + chave + '.mp3', texto: FALAS_FIXAS[chave] });

/* ---------- 2) ESTADO ---------- */

const estado = {
  nome: '',
  nivel: null,
  perguntas: [],
  indice: 0,
  acertos: 0,
  bloqueado: false,
  mudo: false,
  audio: null,
  fala: 0,      // contador para cancelar falas antigas quando a tela muda
  timer: null
};

const CHAVE_RANKING = 'brusqueKidsRanking';

/* Atalho para pegar elementos da página pelo id */
const $ = (id) => document.getElementById(id);

/* ---------- 3) FUNÇÕES ---------- */

/* ===== Utilidades ===== */

function embaralhar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/* ===== Áudio ===== */

const temVoz = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

function escolherVoz() {
  if (!temVoz) return null;
  const vozes = window.speechSynthesis.getVoices();
  return (
    vozes.find((v) => v.lang === 'pt-BR') ||
    vozes.find((v) => v.lang && v.lang.toLowerCase().indexOf('pt') === 0) ||
    null
  );
}

function pararAudio() {
  estado.fala++; // cancela qualquer sequência de falas que estava em andamento
  if (temVoz) window.speechSynthesis.cancel();
  if (estado.audio) {
    try { estado.audio.pause(); } catch (e) { /* sem problema */ }
    estado.audio = null;
  }
}

/* Lê um texto em voz alta. aoTerminar (opcional) roda quando a fala acabar. */
function falar(texto, aoTerminar) {
  if (estado.mudo || !temVoz || !texto) return;
  window.speechSynthesis.cancel();
  // Pequena pausa: evita que o Chrome "engula" a fala logo após cancelar
  setTimeout(() => {
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    fala.rate = 0.9;
    fala.pitch = 1.1;
    const voz = escolherVoz();
    if (voz) fala.voice = voz;
    if (aoTerminar) fala.onend = aoTerminar;
    window.speechSynthesis.speak(fala);
  }, 60);
}

/* Toca um arquivo MP3 (voz humanizada). Se não existir ou falhar, chama aoFalhar. */
function tocarArquivo(arquivo, aoTerminar, aoFalhar) {
  let resolvido = false;
  const falhou = () => {
    if (resolvido) return;
    resolvido = true;
    aoFalhar();
  };
  try {
    const audio = new Audio(arquivo);
    estado.audio = audio;
    audio.onended = () => {
      if (resolvido) return;
      resolvido = true;
      aoTerminar();
    };
    audio.onerror = falhou;
    const promessa = audio.play();
    if (promessa && typeof promessa.catch === 'function') promessa.catch(falhou);
  } catch (e) {
    falhou();
  }
}

/*
  Diz uma lista de falas, uma depois da outra.
  Cada item: { arquivo: 'audio/q01.mp3', texto: 'frase' }
  Primeiro tenta o MP3 (voz humanizada); se não der, usa a voz do navegador.
*/
function dizer(itens, aoTerminar) {
  if (estado.mudo) return;
  pararAudio();
  const meuNumero = estado.fala;
  let i = 0;

  const proximo = () => {
    if (meuNumero !== estado.fala) return; // a tela mudou, para tudo
    if (i >= itens.length) {
      if (aoTerminar) aoTerminar();
      return;
    }
    const item = itens[i++];
    tocarArquivo(item.arquivo, proximo, () => {
      if (meuNumero !== estado.fala) return;
      if (temVoz) falar(item.texto, proximo);
      else proximo();
    });
  };
  proximo();
}

/* Toca o arquivo de som da pergunta; se não existir, fala a frase reserva. */
function tocarSom(q) {
  if (estado.mudo || !q.som) return;
  const reserva = () => falar(q.somReserva);
  try {
    const audio = new Audio(q.som);
    estado.audio = audio;
    const promessa = audio.play();
    if (promessa && typeof promessa.catch === 'function') promessa.catch(reserva);
  } catch (e) {
    reserva();
  }
}

if (temVoz) {
  // Algumas navegadores só carregam as vozes depois de um instante
  window.speechSynthesis.onvoiceschanged = () => escolherVoz();
}

/* ===== Telas ===== */

function mostrarTela(id) {
  clearTimeout(estado.timer);
  pararAudio();
  document.querySelectorAll('.tela').forEach((t) => t.classList.remove('ativa'));
  $(id).classList.add('ativa');
  window.scrollTo(0, 0);
}

/* ===== Início do jogo ===== */

function iniciarJogo(nivel) {
  estado.nivel = nivel;
  estado.acertos = 0;
  estado.indice = 0;
  const doNivel = PERGUNTAS.filter((q) => q.nivel === nivel);
  estado.perguntas = embaralhar(doNivel).slice(0, PERGUNTAS_POR_PARTIDA);
  mostrarPergunta();
}

/* ===== Perguntas ===== */

function mostrarPergunta() {
  const q = estado.perguntas[estado.indice];
  estado.bloqueado = false;

  $('progresso').textContent = 'Pergunta ' + (estado.indice + 1) + ' de ' + estado.perguntas.length;
  $('pontos').textContent = '⭐ ' + estado.acertos;
  $('pergunta-texto').textContent = (estado.indice + 1) + '. ' + q.texto;
  $('visual').className = 'visual' + (q.visualCheio ? ' cheio' : '');
  $('visual').innerHTML = q.visual;
  carregarImagem(q);
  $('btn-som').hidden = !q.som;
  $('alternativas').innerHTML = '';
  $('alternativas').className = 'alternativas';
  $('dica').hidden = true;

  if (q.tipo === 'associar') {
    montarAssociar(q);
  } else if (q.arrastar) {
    montarArrastar(q);
  } else {
    montarEscolha(q);
  }

  mostrarTela('tela-pergunta');
  falarPergunta();
}

/*
  Imagens das perguntas (opcional).
  Se existir um arquivo img/<id da pergunta>.png (ou .jpg, .jpeg, .webp),
  ele aparece no lugar dos emojis. Exemplo: img/q02.jpg para "Onde está a bola?".
  Se não existir imagem, o jogo continua mostrando os emojis normalmente.
*/
const EXTENSOES_IMG = ['png', 'jpg', 'jpeg', 'webp', 'svg'];  // se existir .jpg/.png, ele vale mais que o .svg

function carregarImagem(q) {
  let tentativa = 0;
  const img = new Image();
  img.className = 'foto';
  img.alt = q.texto;

  img.onload = () => {
    // Só troca se o jogador ainda estiver nesta pergunta
    if (estado.perguntas[estado.indice] !== q) return;
    // manterVisual: a imagem aparece embaixo do visual (ex.: as letras continuam na tela)
    if (!q.manterVisual) $('visual').innerHTML = '';
    $('visual').appendChild(img);
  };
  img.onerror = () => {
    tentativa++;
    if (tentativa < EXTENSOES_IMG.length) {
      img.src = 'img/' + q.id + '.' + EXTENSOES_IMG[tentativa];
    }
    // Se nenhuma extensão existir, ficam os emojis
  };
  img.src = 'img/' + q.id + '.' + EXTENSOES_IMG[0];
}

function falarPergunta() {
  const q = estado.perguntas[estado.indice];
  if (!q) return;
  // Se a pergunta tem som, toca o som quando a fala terminar
  dizer([{ arquivo: 'audio/' + q.id + '.mp3', texto: q.fala }], q.som ? () => tocarSom(q) : null);
}

function montarEscolha(q) {
  const botoes = [];
  embaralhar(q.opcoes).forEach((opcao) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'alt';
    b.textContent = (opcao.e ? opcao.e + ' ' : '') + opcao.t;
    b.addEventListener('click', () => {
      if (estado.bloqueado) return;
      estado.bloqueado = true;
      botoes.forEach((item) => {
        item.b.disabled = true;
        if (item.opcao.c) item.b.classList.add('certa');
        else if (item.opcao === opcao) item.b.classList.add('errada');
      });
      const certa = q.opcoes.find((x) => x.c);
      concluirPergunta(opcao.c, q, certa.t);
    });
    botoes.push({ b, opcao });
    $('alternativas').appendChild(b);
  });
}

/* Conteúdo de uma carta de resposta: bandeira (só a imagem) ou emoji + texto */
function conteudoCarta(opcao) {
  if (opcao.svg) return opcao.svg;
  let h = '';
  if (opcao.e) h += '<span class="carta-emoji">' + opcao.e + '</span>';
  h += '<span class="carta-texto">' + opcao.t + '</span>';
  return h;
}

/*
  Pergunta de escolha com ARRASTAR E SOLTAR (perguntas com arrastar: true).
  A criança arrasta a carta até a imagem da pergunta. Tocar na carta também responde,
  para quem ainda tem dificuldade em arrastar. Usa Pointer Events: funciona com mouse e toque.
*/
function montarArrastar(q) {
  const zona = $('visual');
  const area = $('alternativas');
  const certa = q.opcoes.find((x) => x.c);
  const cartas = [];
  area.classList.add('arrastar');
  $('dica').hidden = false;

  const dentro = (x, y) => {
    const r = zona.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const responder = (carta, opcao) => {
    if (estado.bloqueado) return;
    estado.bloqueado = true;
    cartas.forEach((item) => {
      item.c.disabled = true;
      if (item.opcao.c && item.c !== carta) item.c.classList.add('certa');
    });
    if (opcao.c) {
      carta.classList.add('certa', 'na-zona');
      zona.classList.add('ok');
      zona.appendChild(carta);
    } else {
      carta.classList.add('errada', 'tremer');
    }
    concluirPergunta(opcao.c, q, certa.t);
  };

  embaralhar(q.opcoes).forEach((opcao) => {
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'carta';
    c.setAttribute('aria-label', opcao.t);
    c.innerHTML = conteudoCarta(opcao);
    cartas.push({ c, opcao });
    area.appendChild(c);

    let sx, sy, dx, dy, larg = 0, moveu = false, engolirClique = false, ph = null;

    c.addEventListener('pointerdown', (e) => {
      if (estado.bloqueado) return;
      c.setPointerCapture(e.pointerId);
      const r = c.getBoundingClientRect();
      sx = e.clientX; sy = e.clientY;
      dx = e.clientX - r.left; dy = e.clientY - r.top;
      larg = r.width;
      moveu = false;
      ph = document.createElement('div');           // guarda o lugar da carta na fila
      ph.style.cssText = 'width:' + r.width + 'px;height:' + r.height + 'px;flex:none';
    });

    c.addEventListener('pointermove', (e) => {
      if (!c.hasPointerCapture(e.pointerId) || estado.bloqueado) return;
      if (!moveu && Math.hypot(e.clientX - sx, e.clientY - sy) < 6) return;
      if (!moveu) {
        moveu = true;
        c.parentNode.insertBefore(ph, c);
        c.style.width = larg + 'px';
        c.classList.add('dragging');
      }
      c.style.left = (e.clientX - dx) + 'px';
      c.style.top = (e.clientY - dy) + 'px';
      zona.classList.toggle('sobre', dentro(e.clientX, e.clientY));
    });

    c.addEventListener('pointerup', (e) => {
      if (!c.hasPointerCapture(e.pointerId)) return;
      c.releasePointerCapture(e.pointerId);
      zona.classList.remove('sobre');
      if (!moveu) return;                            // toque simples: quem responde é o "click"
      engolirClique = true;
      setTimeout(() => { engolirClique = false; }, 0);
      c.classList.remove('dragging');
      c.style.left = c.style.top = c.style.width = '';
      if (ph.parentNode) ph.replaceWith(c);
      if (dentro(e.clientX, e.clientY)) responder(c, opcao);
    });

    c.addEventListener('pointercancel', () => {
      c.classList.remove('dragging');
      zona.classList.remove('sobre');
      c.style.left = c.style.top = c.style.width = '';
      if (ph && ph.parentNode) ph.replaceWith(c);
    });

    // toque/clique simples (e teclado: Enter ou Espaço)
    c.addEventListener('click', () => {
      if (engolirClique) return;
      responder(c, opcao);
    });
  });
}

function montarAssociar(q) {
  let erros = 0;
  let acertados = 0;
  let animalSel = null; // { botao, par }

  const grade = document.createElement('div');
  grade.className = 'assoc';

  const colAnimais = document.createElement('div');
  colAnimais.className = 'coluna';
  const tituloA = document.createElement('p');
  tituloA.className = 'titulo-coluna';
  tituloA.textContent = 'Animais';
  colAnimais.appendChild(tituloA);

  const colCasas = document.createElement('div');
  colCasas.className = 'coluna';
  const tituloC = document.createElement('p');
  tituloC.className = 'titulo-coluna';
  tituloC.textContent = 'Casas';
  colCasas.appendChild(tituloC);

  q.pares.forEach((par) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'alt';
    b.textContent = par.animal;
    b.addEventListener('click', () => {
      if (estado.bloqueado || b.disabled) return;
      if (animalSel) animalSel.botao.classList.remove('sel');
      animalSel = { botao: b, par: par };
      b.classList.add('sel');
    });
    colAnimais.appendChild(b);
  });

  embaralhar(q.pares).forEach((par) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'alt';
    b.textContent = par.casa;
    b.addEventListener('click', () => {
      if (estado.bloqueado || b.disabled || !animalSel) return;
      if (animalSel.par === par) {
        animalSel.botao.classList.remove('sel');
        animalSel.botao.classList.add('certa');
        animalSel.botao.disabled = true;
        b.classList.add('certa');
        b.disabled = true;
        animalSel = null;
        acertados++;
        if (acertados === q.pares.length) {
          estado.bloqueado = true;
          concluirPergunta(erros === 0, q, q.textoCorreto);
        }
      } else {
        erros++;
        b.classList.add('errada', 'tremer');
        setTimeout(() => b.classList.remove('errada', 'tremer'), 450);
      }
    });
    colCasas.appendChild(b);
  });

  grade.appendChild(colAnimais);
  grade.appendChild(colCasas);
  $('alternativas').appendChild(grade);
}

/* ===== Resposta e feedback ===== */

function concluirPergunta(acertou, q, textoCerto) {
  if (acertou) estado.acertos++;
  $('pontos').textContent = '⭐ ' + estado.acertos;
  // Espera um instante para a criança ver o que marcou
  estado.timer = setTimeout(() => mostrarFeedback(acertou, q, textoCerto), 900);
}

function mostrarFeedback(acertou, q, textoCerto) {
  const card = $('fb-card');
  card.className = 'cartao feedback ' + (acertou ? 'certo' : 'errado');
  $('fb-icone').textContent = acertou ? '✅' : '❌';
  $('fb-titulo').textContent = acertou ? 'Muito bem! Você acertou!' : 'Ops! Você errou!';
  $('fb-explicacao').textContent = q.explicacao;

  const certa = $('fb-certa');
  if (acertou) {
    certa.hidden = true;
  } else {
    certa.hidden = false;
    certa.textContent = 'Não foi dessa vez, mas continue tentando! A resposta certa é: ' + textoCerto + '.';
  }

  const ultima = estado.indice >= estado.perguntas.length - 1;
  $('btn-proxima').textContent = ultima ? 'Ver resultado ➜' : 'Próxima pergunta ➜';

  mostrarTela('tela-feedback');

  // Primeiro "Muito bem!" ou "Ops!", depois a explicação da pergunta
  dizer([
    fixa(acertou ? 'ok' : 'erro'),
    { arquivo: 'audio/' + q.id + '-exp.mp3', texto: q.explicacao }
  ]);
}

function proximaPergunta() {
  estado.indice++;
  if (estado.indice >= estado.perguntas.length) {
    finalizarJogo();
  } else {
    mostrarPergunta();
  }
}

/* ===== Fim do jogo e ranking ===== */

function carregarRanking() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_RANKING) || '[]');
    return Array.isArray(dados) ? dados : [];
  } catch (e) {
    return [];
  }
}

function salvarNoRanking(registro) {
  const lista = carregarRanking();
  lista.push(registro);
  lista.sort((a, b) => b.pontos - a.pontos);
  const top = lista.slice(0, 10);
  try {
    localStorage.setItem(CHAVE_RANKING, JSON.stringify(top));
  } catch (e) { /* navegador bloqueou o armazenamento: o jogo continua normal */ }
}

function desenharRanking(ol, limite) {
  ol.innerHTML = '';
  const lista = carregarRanking().slice(0, limite);
  if (lista.length === 0) {
    const li = document.createElement('li');
    li.className = 'vazio';
    li.textContent = 'Ainda não há jogadores. Seja o primeiro!';
    ol.appendChild(li);
    return;
  }
  lista.forEach((r) => {
    const li = document.createElement('li');
    li.textContent = r.nome + ' - ' + r.pontos + ' pontos (' + (NOMES_NIVEL[r.nivel] || '') + ')';
    ol.appendChild(li);
  });
}

function finalizarJogo() {
  const total = estado.perguntas.length;
  const proporcao = total ? estado.acertos / total : 0;
  const pontos = estado.acertos * 10;
  const nome = estado.nome || 'Jogador';

  let estrelas = '⭐';
  let chaveMsg = 'fim-1';
  if (proporcao >= 0.8) {
    estrelas = '⭐⭐⭐';
    chaveMsg = 'fim-3';
  } else if (proporcao >= 0.5) {
    estrelas = '⭐⭐';
    chaveMsg = 'fim-2';
  }
  const msg = FALAS_FIXAS[chaveMsg];

  $('final-titulo').textContent = 'Parabéns, ' + nome + '!';
  $('final-estrelas').textContent = estrelas;
  $('final-placar').textContent = 'Você acertou ' + estado.acertos + ' de ' + total + ' perguntas';
  $('final-msg').textContent = msg;

  salvarNoRanking({ nome: nome, pontos: pontos, nivel: estado.nivel });
  desenharRanking($('lista-ranking-final'), 5);

  mostrarTela('tela-final');
  dizer([fixa('fim'), fixa(chaveMsg)]);
}

/* ===== Botões ===== */

$('btn-jogar').addEventListener('click', () => {
  estado.nome = $('nome').value.trim();
  mostrarTela('tela-nivel');
  dizer([fixa('nivel')]);
});

$('btn-ranking').addEventListener('click', () => {
  desenharRanking($('lista-ranking'), 10);
  mostrarTela('tela-ranking');
});

$('btn-ranking-voltar').addEventListener('click', () => mostrarTela('tela-inicial'));
$('btn-voltar-nivel').addEventListener('click', () => mostrarTela('tela-inicial'));

document.querySelectorAll('.btn-nivel').forEach((b) => {
  b.addEventListener('click', () => iniciarJogo(b.dataset.nivel));
});

$('btn-ouvir').addEventListener('click', falarPergunta);

$('btn-som').addEventListener('click', () => {
  const q = estado.perguntas[estado.indice];
  if (q) tocarSom(q);
});

$('btn-proxima').addEventListener('click', proximaPergunta);

$('btn-de-novo').addEventListener('click', () => iniciarJogo(estado.nivel));
$('btn-inicio').addEventListener('click', () => mostrarTela('tela-inicial'));

$('btn-mudo').addEventListener('click', () => {
  estado.mudo = !estado.mudo;
  $('btn-mudo').textContent = estado.mudo ? '🔇' : '🔊';
  if (estado.mudo) pararAudio();
});

/* ===== Fundo do jogo (muda a cada vez que a página abre) ===== */

/*
  Lista de fundos possíveis. O jogo sorteia um que EXISTA na pasta img/
  e evita repetir o mesmo da vez anterior.
  Os 3 primeiros já vêm prontos. Os .jpg são opcionais: se vocês gerarem
  fundos com IA, salvem com esses nomes (ou acrescentem outros nomes nesta lista).
*/
const FUNDOS = [
  'img/fundo-dia.svg',
  'img/fundo-tarde.svg',
  'img/fundo-ponte.svg',
  'img/fundo.jpg',
  'img/fundo2.jpg',
  'img/fundo3.jpg'
];
const CHAVE_FUNDO = 'brusqueKidsFundo';

function escolherFundo() {
  let ultimo = null;
  try { ultimo = localStorage.getItem(CHAVE_FUNDO); } catch (e) { /* sem problema */ }

  // Embaralha e deixa o último usado por último, para não repetir em seguida
  const sorteados = embaralhar(FUNDOS);
  const fila = sorteados.filter((f) => f !== ultimo).concat(sorteados.filter((f) => f === ultimo));

  const raiz = document.documentElement.style;
  const tentar = (i) => {
    if (i >= fila.length) {
      // Nenhum arquivo carregou (ex.: pasta img ausente): usa o fundo de reserva do CSS
      raiz.setProperty('--fundo-escolhido', 'var(--fundo-padrao)');
      return;
    }
    const teste = new Image();
    teste.onload = () => {
      raiz.setProperty('--fundo-escolhido', 'url("' + fila[i] + '")');
      try { localStorage.setItem(CHAVE_FUNDO, fila[i]); } catch (e) { /* sem problema */ }
    };
    teste.onerror = () => tentar(i + 1); // arquivo não existe: tenta o próximo
    teste.src = fila[i];
  };
  tentar(0);
}

escolherFundo();
