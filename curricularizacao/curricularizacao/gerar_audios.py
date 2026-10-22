"""
Gera os áudios (voz feminina humanizada) do Brusque Kids.

Como usar (no computador de vocês):
    pip install edge-tts        (só na primeira vez)
    python gerar_audios.py

O script lê as falas do script.js e cria/atualiza a pasta audio/ com um MP3 por fala.
Ele guarda em audio/textos.json o texto de cada áudio. Assim, quando vocês
mudam um texto no script.js, basta rodar de novo: ele refaz SÓ os áudios
que faltam ou cujo texto mudou (os outros são pulados).

Outras opções:
    python gerar_audios.py --listar            mostra o que está ok, o que é novo e o que mudou (sem gerar nada)
    python gerar_audios.py --refazer           refaz TODOS os áudios
    python gerar_audios.py --voz pt-BR-ThalitaNeural   troca a voz (refaz todos)
"""
import asyncio
import json
import re
import sys
from pathlib import Path

PASTA = Path(__file__).parent
SAIDA = PASTA / "audio"
MANIFESTO = SAIDA / "textos.json"

VOZ_PADRAO = "pt-BR-FranciscaNeural"   # feminina, pt-BR
VELOCIDADE = "-8%"                     # um pouco mais devagar, bom para crianças
TOM = "+3Hz"                           # um pouco mais agudo e simpático

TEXTO_JS = r"'((?:[^'\\]|\\.)*)'"      # texto entre aspas simples (aceita \')


def desescapar(s):
    return s.replace("\\'", "'")


def ler_falas():
    """Lê o script.js e devolve uma lista de (nome_do_arquivo, texto)."""
    js = (PASTA / "script.js").read_text(encoding="utf-8")
    falas = []

    # Falas fixas (nivel, ok, erro, fim...)
    bloco = re.search(r"const FALAS_FIXAS = \{(.*?)\n\};", js, re.DOTALL)
    if not bloco:
        sys.exit("Não achei FALAS_FIXAS no script.js")
    for chave, texto in re.findall(r"'([^']+)':\s*" + TEXTO_JS, bloco.group(1)):
        falas.append((chave, desescapar(texto)))

    # Perguntas: cada uma começa com id: 'q01', id: 'q02'...
    for pedaco in re.split(r"(?=id: 'q\d\d')", js):
        m_id = re.match(r"id: '(q\d\d)'", pedaco)
        if not m_id:
            continue
        qid = m_id.group(1)
        fala = re.search(r"fala:\s*" + TEXTO_JS, pedaco)
        exp = re.search(r"explicacao:\s*" + TEXTO_JS, pedaco)
        if fala:
            falas.append((qid, desescapar(fala.group(1))))
        if exp:
            falas.append((qid + "-exp", desescapar(exp.group(1))))
    return falas


def ler_manifesto():
    try:
        return json.loads(MANIFESTO.read_text(encoding="utf-8"))
    except Exception:
        return None


def salvar_manifesto(dados):
    SAIDA.mkdir(exist_ok=True)
    MANIFESTO.write_text(json.dumps(dados, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")


def situacao(falas, voz, refazer):
    """Para cada fala diz: 'ok', 'novo' (não tem MP3), 'mudou' (texto diferente) ou 'refazer'."""
    manifesto = ler_manifesto()
    sem_manifesto = manifesto is None
    textos = (manifesto or {}).get("textos", {})
    voz_antiga = (manifesto or {}).get("voz")
    voz_mudou = (not sem_manifesto) and voz_antiga is not None and voz_antiga != voz
    resultado = []
    for nome, texto in falas:
        existe = (SAIDA / (nome + ".mp3")).exists()
        if refazer or sem_manifesto or voz_mudou:
            estado = "refazer" if existe else "novo"
        elif not existe:
            estado = "novo"
        elif textos.get(nome) != texto:
            estado = "mudou"
        else:
            estado = "ok"
        resultado.append((nome, texto, estado))
    return resultado, sem_manifesto, voz_mudou


async def gerar(falas, voz, refazer):
    import edge_tts

    SAIDA.mkdir(exist_ok=True)
    resultado, sem_manifesto, voz_mudou = situacao(falas, voz, refazer)
    if sem_manifesto and not refazer:
        print("(Primeira vez com controle de textos: vou refazer todos os áudios para garantir que estão certos.)\n")
    if voz_mudou:
        print("(A voz mudou: vou refazer todos os áudios.)\n")

    manifesto = ler_manifesto() or {}
    textos = {} if (sem_manifesto or refazer or voz_mudou) else dict(manifesto.get("textos", {}))
    # mantém registrado o que já estava ok
    for nome, texto, estado in resultado:
        if estado == "ok":
            textos[nome] = texto

    feitos = pulados = falharam = 0
    for nome, texto, estado in resultado:
        if estado == "ok":
            pulados += 1
            continue
        destino = SAIDA / (nome + ".mp3")
        gerou = False
        for tentativa in range(3):
            try:
                comunicar = edge_tts.Communicate(texto, voz, rate=VELOCIDADE, pitch=TOM)
                await comunicar.save(str(destino))
                gerou = True
                break
            except Exception as erro:  # tenta de novo se a internet falhar
                print("falhou", destino.name, "-", erro)
        if gerou:
            feitos += 1
            textos[nome] = texto
            print("ok  ", destino.name, "(" + estado + ")")
            salvar_manifesto({"voz": voz, "textos": textos})   # salva a cada áudio: se cair a internet, não perde
        else:
            falharam += 1
            textos.pop(nome, None)
            print("   (pulei", destino.name + "; rode o script de novo depois)")
    salvar_manifesto({"voz": voz, "textos": textos})
    print("\nPronto! Gerados: %d | já estavam certos: %d | falharam: %d | pasta: %s" % (feitos, pulados, falharam, SAIDA))
    if falharam:
        print("Alguns falharam (provavelmente a internet). Rode  python gerar_audios.py  de novo.")


def main():
    args = sys.argv[1:]
    voz = VOZ_PADRAO
    if "--voz" in args:
        voz = args[args.index("--voz") + 1]
    refazer = "--refazer" in args

    falas = ler_falas()

    if "--listar" in args:
        resultado, sem_manifesto, voz_mudou = situacao(falas, voz, refazer)
        for nome, texto, estado in resultado:
            print("[%-7s] %s.mp3  <-  %s" % (estado.upper(), nome, texto))
        a_gerar = [r for r in resultado if r[2] != "ok"]
        print("\nTotal: %d áudios | a gerar: %d | %d caracteres no total" % (len(resultado), len(a_gerar), sum(len(t) for _, t in falas)))
        if sem_manifesto:
            print("(Ainda não existe audio/textos.json: na primeira vez o script refaz todos.)")
        return

    try:
        import edge_tts  # noqa: F401
    except ImportError:
        sys.exit("Falta instalar a biblioteca. Rode antes:  python -m pip install edge-tts")

    asyncio.run(gerar(falas, voz, refazer))


if __name__ == "__main__":
    main()
