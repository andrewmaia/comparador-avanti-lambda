/** @format */
"use strict";

import { comparar } from "../../comparador.mjs";
import { expect } from "chai";

describe("Lambda Comparação", function () {
  const event = { body: "1=Gol Norte&6=Superior Leste&8=Setor D1" },
    planos = mockPlanos(),
    jogos = mockJogos();

  const planosComparados = comparar(event.body, planos, jogos);

  it("Quantidade de Planos Comparados", async () => {
    expect(planosComparados.length).to.equal(3);
  });

  it("Quantidade de Jogos", async () => {
    expect(planosComparados[0].jogos.length).to.equal(3);
    expect(planosComparados[1].jogos.length).to.equal(3);
  });

  it("Calculo Valor Total de Mensalidades", async () => {
    expect(planosComparados[0].quantidadeMesesPeriodo).to.equal(2);
    expect(planosComparados[0].valorMensalidadesPeriodo).to.equal(83.98);
    expect(planosComparados[1].quantidadeMesesPeriodo).to.equal(2);
    expect(planosComparados[1].valorMensalidadesPeriodo).to.equal(155.98);
  });

  it("Valor Ingressos", async () => {
    expect(planosComparados[0].jogos[0].valorIngresso).to.equal(50);
    expect(planosComparados[0].jogos[1].valorIngresso).to.equal(60);
    expect(planosComparados[0].jogos[2].valorIngresso).to.equal(40);
    expect(planosComparados[1].jogos[0].valorIngresso).to.equal(50);
    expect(planosComparados[1].jogos[1].valorIngresso).to.equal(30);
    expect(planosComparados[1].jogos[2].valorIngresso).to.equal(40);
  });

  it("Valor Total Plano", async () => {
    expect(planosComparados[0].valorTotal.toFixed(2)).to.equal("233.98");
    expect(planosComparados[1].valorTotal.toFixed(2)).to.equal("275.98");
  });

  it("Inclui plano Sem Plano automaticamente", async () => {
    const semPlano = planosComparados.find((plano) => plano.planoId === "0");

    expect(semPlano).to.not.equal(undefined);
    expect(semPlano.planoNome).to.equal("Sem Plano");
    expect(semPlano.quantidadeMesesPeriodo).to.equal(0);
  });
});

describe("Lambda Comparação - cenários adicionais", function () {
  it("Ignora jogo sem setor selecionado", async () => {
    const planosComparados = comparar(
      "1=Gol Norte&6=&8=Setor D1",
      mockPlanos(),
      mockJogos()
    );

    const planoPrata = planosComparados.find((plano) => plano.planoId === "4");
    const semPlano = planosComparados.find((plano) => plano.planoId === "0");

    expect(planoPrata.jogos.length).to.equal(2);
    expect(semPlano.jogos.length).to.equal(2);
  });

  it("Usa valor cheio em estádio fora do Allianz quando o plano não está mapeado", async () => {
    const planos = [
      {
        id: "10",
        nome: "Plano Visitante",
        valor: 60,
        setoresDesconto: [],
        statusPlano: "ok",
      },
    ];

    const planosComparados = comparar("8=Setor D1", planos, mockJogos());
    const planoVisitante = planosComparados.find(
      (plano) => plano.planoId === "10"
    );

    expect(planoVisitante.jogos[0].valorIngresso).to.equal(80);
  });

  it("Ordena jogos por data antes de calcular os totais", async () => {
    const planosComparados = comparar(
      "8=Setor D1&1=Gol Norte&6=Superior Leste",
      mockPlanos(),
      mockJogos()
    );

    const planoPrata = planosComparados.find((plano) => plano.planoId === "4");
    expect(planoPrata.jogos.map((jogo) => jogo.jogoId)).to.deep.equal([
      "1",
      "6",
      "8",
    ]);
    expect(planoPrata.quantidadeMesesPeriodo).to.equal(2);
  });

  it("Calcula apenas o mês corrente quando existe um único jogo", async () => {
    const planosComparados = comparar("1=Gol Norte", mockPlanos(), mockJogos());
    const planoPrata = planosComparados.find((plano) => plano.planoId === "4");
    const semPlano = planosComparados.find((plano) => plano.planoId === "0");

    expect(planoPrata.quantidadeMesesPeriodo).to.equal(1);
    expect(planoPrata.valorMensalidadesPeriodo).to.equal(41.99);
    expect(semPlano.quantidadeMesesPeriodo).to.equal(0);
  });
});

function mockPlanos() {
  return [
    {
      id: "4",
      nome: "Plano Prata",
      valor: 41.99,
      setoresDesconto: [
        { setorNome: "Gol Norte", percentualDesconto: 50 },
        { setorNome: "Gol Sul", percentualDesconto: 50 },
        { setorNome: "Central Leste", percentualDesconto: 25 },
        { setorNome: "Central Oeste", percentualDesconto: 0 },
        {
          setorNome: "Superior",
          percentualDesconto: 50,
          subSetores: [
            "Superior Norte",
            "Superior Sul",
            "Superior Leste",
            "Superior Oeste",
          ],
        },
      ],
      statusPlano: "ok",
    },
    {
      id: "5",
      nome: "Prata Superior",
      valor: 77.99,
      setoresDesconto: [
        { setorNome: "Gol Norte", percentualDesconto: 50 },
        { setorNome: "Gol Sul", percentualDesconto: 50 },
        { setorNome: "Central Leste", percentualDesconto: 25 },
        { setorNome: "Central Oeste", percentualDesconto: 0 },
        {
          setorNome: "Superior",
          percentualDesconto: 75,
          subSetores: [
            "Superior Norte",
            "Superior Sul",
            "Superior Leste",
            "Superior Oeste",
          ],
        },
      ],
      statusPlano: "ok",
    },
  ];
}

function mockJogos() {
  return [
    {
      id: "1",
      adversario: "Atlético Mineiro",
      dataJogo: "2023-10-19",
      allianzParque: true,
      setores: [
        {
          setorNome: "Gol Norte",
          valorIngresso: 100,
        },
        {
          setorNome: "Gol Sul",
          valorIngresso: 140,
        },
        {
          setorNome: "Central Leste",
          valorIngresso: 180,
        },
        {
          setorNome: "Central Oeste",
          valorIngresso: 200,
        },
        {
          setorNome: "Superior Norte",
          valorIngresso: 110,
        },
        {
          setorNome: "Superior Sul",
          valorIngresso: 110,
        },
        {
          setorNome: "Superior Leste",
          valorIngresso: 120,
        },
        {
          setorNome: "Superior Oeste",
          valorIngresso: 120,
        },
      ],
      statusJogo: "ok",
    },
    {
      id: "6",
      adversario: "Bahia",
      dataJogo: "2023-10-28",
      allianzParque: true,
      setores: [
        {
          setorNome: "Gol Norte",
          valorIngresso: 100,
        },
        {
          setorNome: "Gol Sul",
          valorIngresso: 140,
        },
        {
          setorNome: "Central Leste",
          valorIngresso: 180,
        },
        {
          setorNome: "Central Oeste",
          valorIngresso: 200,
        },
        {
          setorNome: "Superior Norte",
          valorIngresso: 110,
        },
        {
          setorNome: "Superior Sul",
          valorIngresso: 110,
        },
        {
          setorNome: "Superior Leste",
          valorIngresso: 120,
        },
        {
          setorNome: "Superior Oeste",
          valorIngresso: 120,
        },
      ],
      statusJogo: "ok",
    },

    {
      id: "8",
      adversario: "Internacional",
      dataJogo: "2023-11-11",
      allianzParque: false,
      nomeEstadio: "Arena Barueri",
      setores: [
        {
          setorNome: "Setor A",
          valorIngresso: 140,
          "Plano Bronze": 140,
          "Plano Prata": 140,
          "Prata Superior": 140,
          "Plano Ouro": 105,
          "Plano Platina": 70,
          "Plano Diamante": 0,
        },
        {
          setorNome: "Setor A1",
          valorIngresso: 140,
          "Plano Bronze": 140,
          "Plano Prata": 140,
          "Prata Superior": 140,
          "Plano Ouro": 105,
          "Plano Platina": 70,
          "Plano Diamante": 0,
        },
        {
          setorNome: "Setor B",
          valorIngresso: 60,
          "Plano Bronze": 48,
          "Plano Prata": 30,
          "Prata Superior": 30,
          "Plano Ouro": 0,
          "Plano Platina": 0,
          "Plano Diamante": 0,
        },
        {
          setorNome: "Setor C",
          valorIngresso: 100,
          "Plano Bronze": 100,
          "Plano Prata": 75,
          "Prata Superior": 75,
          "Plano Ouro": 50,
          "Plano Platina": 25,
          "Plano Diamante": 0,
        },
        {
          setorNome: "Setor C1",
          valorIngresso: 100,
          "Plano Bronze": 100,
          "Plano Prata": 75,
          "Prata Superior": 75,
          "Plano Ouro": 50,
          "Plano Platina": 25,
          "Plano Diamante": 0,
        },
        {
          setorNome: "Setor D1",
          valorIngresso: 80,
          "Plano Bronze": 64,
          "Plano Prata": 40,
          "Prata Superior": 40,
          "Plano Ouro": 20,
          "Plano Platina": 0,
          "Plano Diamante": 0,
        },
      ],
      statusJogo: "ok",
    },
  ];
}
