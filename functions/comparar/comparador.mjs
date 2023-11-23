/** @format */

export function comparar(body, planos, jogos) {
  const planosComparados = new Map();

  //Sem plano
  planos.push({
    id: "0",
    nome: "Sem Plano",
    valor: 0,
    setoresDesconto: [
      { setorNome: "Gol Norte", percentualDesconto: 0 },
      { setorNome: "Gol Sul", percentualDesconto: 0 },
      { setorNome: "Central Leste", percentualDesconto: 0 },
      { setorNome: "Central Oeste", percentualDesconto: 0 },
      { setorNome: "Superior Norte", percentualDesconto: 0 },
      { setorNome: "Superior Sul", percentualDesconto: 0 },
      { setorNome: "Superior Leste", percentualDesconto: 0 },
      { setorNome: "Superior Oeste", percentualDesconto: 0 },
    ],
  });

  let params = body.split("&");
  params.forEach((jogoSetor) => {
    let jogoSetorArray = jogoSetor.split("=");
    let jogoId = jogoSetorArray[0];
    let setorNome = jogoSetorArray[1];

    //Não foi no jogo
    if (setorNome === "") return;

    let jogo = jogos.find((jogo) => jogo.id === jogoId);
    planos.forEach((plano) => {
      const jogoComValorIngresso = calcularValorJogoPorPlano(
        jogo,
        setorNome,
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

function calcularValorJogoPorPlano(jogo, setorNome, plano) {
  let valorIngresso = 0;
  const setor = jogo.setores.find((setor) => setor.setorNome === setorNome);
  if (jogo.allianzParque) {
    let setorDesconto = plano.setoresDesconto.find((setorDesconto) => {
      if (setorDesconto.setorNome === setorNome) return true;
      if (setorDesconto.subSetores !== undefined) {
        return setorDesconto.subSetores.includes(setorNome);
      }
      return false;
    });

    valorIngresso =
      setor.valorIngresso -
      setor.valorIngresso * (setorDesconto.percentualDesconto / 100);
  } else {
    valorIngresso = setor[plano.nome];
    if (valorIngresso === undefined) valorIngresso = setor.valorIngresso;
  }

  return {
    jogoId: jogo.id,
    jogoAdversario: jogo.adversario,
    jogoData: jogo.dataJogo,
    setorComprado: setorNome,
    valorIngresso: valorIngresso,
  };
}

function calcularValoresTotaisPlano(plano) {
  plano.jogos.sort((a, b) => {
    return new Date(a.jogoData) - new Date(b.jogoData);
  });

  const jogoMaisAntigo = plano.jogos[0];
  const jogoMaisRecente = plano.jogos[plano.jogos.length - 1];

  if (plano.planoNome !== "Sem Plano") {
    plano.quantidadeMesesPeriodo = mesesParaPagar(
      jogoMaisAntigo.jogoData,
      jogoMaisRecente.jogoData
    );
  }
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
