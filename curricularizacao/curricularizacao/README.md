# Brusque Kids 🐦🦫🐒

**Aprender brincando, crescer explorando!**

Jogo educativo para crianças de até 11 anos, criado pelo **Grupo 16** como projeto de curricularização para a Prefeitura de Brusque - SC. As perguntas usam lugares e elementos da cidade (Ponte Irineu Bornhausen, Praça Barão de Schneeburg, Rio Itajaí-Mirim, Fenarreco, capivaras etc.).

## ▶️ Como jogar

1. Abra o link do jogo no navegador (Chrome, Firefox ou Edge).
2. Digite seu nome (é opcional) e toque em **Vamos jogar!**
3. Escolha o nível: **Fácil**, **Médio** ou **Difícil**.
4. A pergunta é lida em voz alta. Para ouvir de novo, toque em **🔊 Ouvir pergunta**.
5. Escolha uma das alternativas. O jogo diz se você acertou ou errou e **explica o porquê** da resposta.
6. No final, veja sua pontuação e o ranking.

## ✨ O que tem no jogo

- Tela de apresentação com nome opcional do jogador
- 3 níveis de dificuldade (10 perguntas por partida, sorteadas do banco de perguntas)
- **Áudio** que lê as perguntas e as explicações (voz do navegador em português)
- Perguntas com figuras, letras, contagem e sons
- **Arrastar e soltar** em algumas perguntas (q08, q09, q10 e q30): a criança arrasta a carta da resposta até a imagem, ou apenas toca nela. Para ligar em outra pergunta, basta colocar `arrastar: true` nela no `script.js`
- Feedback com explicação em cada resposta
- Pontuação em estrelas e ranking salvo no próprio navegador
- Botão para ligar e desligar o som

## 🧩 Temas das perguntas

| Integrante | Tema |
|---|---|
| Tiago Peixer | Noções Espaciais |
| Erik Scalvim | Contagem e Quantidade |
| Lucas José Deschamps | Animais e seus Habitats |
| Mateus Diego Senhori | Percepção Visual e Compreensão Auditiva |
| João Guilherme Russi | Letras e Palavras |

## 🗂️ Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Estrutura das telas do jogo |
| `style.css` | Cores, tamanhos e visual infantil |
| `script.js` | Perguntas, regras do jogo, áudio e ranking |
| `audio/` | Vozes das perguntas e explicações (MP3) e sons das perguntas (`leao.mp3`, `ondas.mp3`, `lobo.mp3`) |
| `gerar_audios.py` | Script que gera as vozes femininas em `audio/` a partir dos textos do `script.js` |

## 🖼️ Imagens

As perguntas mais visuais podem ter uma imagem na pasta `img/`, com o nome da pergunta (por exemplo, `img/q02.jpg`; também funcionam `.png`, `.jpeg`, `.webp` e `.svg`; se existir foto e `.svg` da mesma pergunta, vale a foto). Quando a imagem existe, ela aparece no lugar dos emojis; quando não existe, o jogo mostra os emojis.

## 🔊 Áudio

As perguntas e explicações são narradas por uma voz feminina neural em português do Brasil, gerada com a biblioteca `edge-tts` (`python gerar_audios.py`). O script guarda os textos em `audio/textos.json` e, ao rodar de novo, refaz só os áudios que faltam ou cujo texto mudou (`--listar` mostra o que será gerado; `--refazer` refaz todos). Se algum arquivo de áudio não for encontrado, o jogo usa automaticamente a voz do navegador.

## 🌐 Compatibilidade

Testado para funcionar nos navegadores **Google Chrome**, **Mozilla Firefox** e **Microsoft Edge**. Sem os MP3, o áudio das perguntas depende das vozes em português instaladas no dispositivo.

## 🛠️ Tecnologias

HTML5, CSS3 e JavaScript puro (sem bibliotecas).

## 👥 Autores

Grupo 16: Tiago Peixer, Erik Scalvim, Lucas José Deschamps, Mateus Diego Senhori e João Guilherme Russi.
