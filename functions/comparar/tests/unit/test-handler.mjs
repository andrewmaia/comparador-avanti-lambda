/** @format */
"use strict";

import { comparar } from "../../comparador.mjs";
import { expect } from "chai";

describe("Lambda Comparação", function () {
  const event = { body: "1=Gol Norte&8=Setor D1" },
    planos = mockPlanos(),
    jogos = mockJogos();

  const planosComparados = comparar(event.body, planos, jogos);

  it("Quantidade de Planos Comparados", async () => {
    expect(planosComparados.length).to.equal(3);
  });

  it("Quantidade de Jogos", async () => {
    expect(planosComparados[0].jogos.length).to.equal(2);
    expect(planosComparados[1].jogos.length).to.equal(2);
  });

  it("Calculo Valor Total de Mensalidades", async () => {
    expect(planosComparados[0].quantidadeMesesPeriodo).to.equal(2);
    expect(planosComparados[0].valorMensalidadesPeriodo).to.equal(83.98);
    expect(planosComparados[1].quantidadeMesesPeriodo).to.equal(2);
    expect(planosComparados[1].valorMensalidadesPeriodo).to.equal(155.98);
  });

  it("Valor Ingressos", async () => {
    expect(planosComparados[0].jogos[0].valorIngresso).to.equal(50);
    expect(planosComparados[0].jogos[1].valorIngresso).to.equal(40);
    expect(planosComparados[1].jogos[0].valorIngresso).to.equal(50);
    expect(planosComparados[1].jogos[1].valorIngresso).to.equal(40);
  });

  it("Valor Total Plano", async () => {
    expect(planosComparados[0].valorTotal.toFixed(2)).to.equal("173.98");
    expect(planosComparados[1].valorTotal.toFixed(2)).to.equal("245.98");
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
        { setorNome: "Superior Norte", percentualDesconto: 50 },
        { setorNome: "Superior Sul", percentualDesconto: 50 },
        { setorNome: "Superior Leste", percentualDesconto: 50 },
        { setorNome: "Superior Oeste", percentualDesconto: 50 },
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
        { setorNome: "Superior Norte", percentualDesconto: 75 },
        { setorNome: "Superior Sul", percentualDesconto: 75 },
        { setorNome: "Superior Leste", percentualDesconto: 75 },
        { setorNome: "Superior Oeste", percentualDesconto: 75 },
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
      AllianzParque: true,
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
      AllianzParque: false,
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
