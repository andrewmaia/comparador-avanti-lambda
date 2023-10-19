/** @format */

export function comparar(body, planos, jogos) {
  const planosComparados = new Map();

  //Sem plano
  planos.push({
    id: "0",
    nome: "Sem Plano",
    valor: 0,
    golNorteDesconto: 0,
    golSulDesconto: 0,
    centralLesteDesconto: 0,
    centralOesteDesconto: 0,
    superiorDesconto: 0,
  });

  let params = body.split("&");
  params.forEach((jogoSetor) => {
    let jogoSetorArray = jogoSetor.split("=");
    let jogoId = jogoSetorArray[0];
    let setor = jogoSetorArray[1];

    //Não foi no jogo
    if (setor === "") return;

    let jogo = jogos.find((jogo) => jogo.id === jogoId);

    planos.forEach((plano) => {
      const jogoComValorIngresso = calcularValorJogoPorPlano(
        jogo,
        setor,
        plano
      );

      if (!planosComparados.has(plano.id)) {
        planosComparados.set(plano.id, {
          planoId: plano.id,
          planoNome: plano.nome,
          planoValor: plano.valor,
          quantidadeMesesPeriodo: 0,
          valorMensalidadesPeriodo: 0,
          valorTotalIngressos: 0,
          valorTotal: 0,
          jogos: [],
        });
      }

      const planoComparado = planosComparados.get(plano.id);
      planoComparado.jogos.push(jogoComValorIngresso);
    });
  });

  planosComparados.forEach((plano) => calcularValoresTotaisPlano(plano));

  return Array.from(planosComparados.values());
}

function calcularValorJogoPorPlano(jogo, setor, plano, planosComparados) {
  let valorIngresso = 0;
  switch (setor) {
    case "gn":
      valorIngresso =
        jogo.golNorteValor -
        jogo.golNorteValor * (plano.golNorteDesconto / 100);
      break;
    case "gs":
      valorIngresso =
        jogo.golSulValor - jogo.golSulValor * (plano.golSulDesconto / 100);
      break;
    case "co":
      valorIngresso =
        jogo.centralOesteValor -
        jogo.centralOesteValor * (plano.centralOesteDesconto / 100);
      break;
    case "cl":
      valorIngresso =
        jogo.centraLesteValor -
        jogo.centraLesteValor * (plano.centralLesteDesconto / 100);
      break;
    case "sn":
      valorIngresso =
        jogo.superiorNorteValor -
        jogo.superiorNorteValor * (plano.superiorDesconto / 100);
      break;
    case "ss":
      valorIngresso =
        jogo.superiorSulValor -
        jogo.superiorSulValor * (plano.superiorDesconto / 100);
      break;
    case "sl":
      valorIngresso =
        jogo.superiorLesteValor -
        jogo.superiorLesteValor * (plano.superiorDesconto / 100);
      break;
    case "so":
      valorIngresso =
        jogo.superiorOesteValor -
        jogo.superiorOesteValor * (plano.superiorDesconto / 100);
      break;
    default:
      valorIngresso = 0;
  }

  return {
    jogoId: jogo.id,
    jogoAdversario: jogo.adversario,
    jogoData: jogo.dataJogo,
    setorComprado: setor,
    valorIngresso: valorIngresso,
  };
}

function calcularValoresTotaisPlano(plano) {
  plano.jogos.sort((a, b) => {
    return new Date(a.jogoData) - new Date(b.jogoData);
  });

  const jogoMaisAntigo = plano.jogos[0];
  const jogoMaisRecente = plano.jogos[plano.jogos.length - 1];
  plano.quantidadeMesesPeriodo = mesesParaPagar(
    jogoMaisAntigo.jogoData,
    jogoMaisRecente.jogoData
  );
  plano.valorMensalidadesPeriodo =
    plano.planoValor * plano.quantidadeMesesPeriodo;

  plano.valorTotalIngressos = plano.jogos.reduce((total, jogo) => {
    return { valorIngresso: total.valorIngresso + jogo.valorIngresso };
  }).valorIngresso;
  plano.valorTotal = plano.valorMensalidadesPeriodo + plano.valorTotalIngressos;
}

function mesesParaPagar(d1s, d2s) {
  const d1 = new Date(d1s);
  const d2 = new Date(d2s);

  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  months = months <= 0 ? 0 : months;
  months++;
  return months;
}