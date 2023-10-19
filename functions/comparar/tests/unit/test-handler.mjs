/** @format */
"use strict";

import { comparar } from "../../comparador.mjs";
import { expect } from "chai";

describe("Lambda Comparação", function () {
  const event = { body: "1=gn&3=gs" },
    planos = mockPlanos(),
    jogos = mockJogos();

  const result = comparar(event.body, planos, jogos);

  it("Quantidade de Planos Comparados", async () => {
    expect(result.length).to.equal(3);
  });

  it("Quantidade de Jogos", async () => {
    expect(result[0].jogos.length).to.equal(2);
    expect(result[1].jogos.length).to.equal(2);
  });

  it("Calculo Valor Total de Mensalidades", async () => {
    expect(result[0].quantidadeMesesPeriodo).to.equal(2);
    expect(result[0].valorMensalidadesPeriodo).to.equal(83.99);
    expect(result[1].quantidadeMesesPeriodo).to.equal(2);
    expect(result[1].valorMensalidadesPeriodo).to.equal(155.98);
  });

  it("Valor Ingressos com Desconto", async () => {
    expect(result[0].jogos[0].valorIngresso).to.equal(70);
    expect(result[0].jogos[1].valorIngresso).to.equal(50);
    expect(result[1].jogos[0].valorIngresso).to.equal(140);
    expect(result[1].jogos[1].valorIngresso).to.equal(25);
  });

  it("Valor Total Plano", async () => {
    expect(result[0].valorTotal.toFixed(2)).to.equal("203.98");
    expect(result[1].valorTotal.toFixed(2)).to.equal("320.98");
  });
});

function mockPlanos() {
  return [
    {
      id: "4",
      nome: "Plano Prata",
      valor: 41.99,
      centralOesteDesconto: 0,
      centralLesteDesconto: 25,
      golSulDesconto: 50,
      golNorteDesconto: 50,
      superiorDesconto: 50,
    },
    {
      id: "5",
      nome: "Prata Superior",
      valor: 77.99,
      centralOesteDesconto: 0,
      centralLesteDesconto: 25,
      golSulDesconto: 0,
      golNorteDesconto: 75,
      superiorDesconto: 75,
    },
  ];
}

function mockJogos() {
  return [
    {
      id: "1",
      adversario: "Atlético Mineiro",
      dataJogo: "2023-10-19",
      golNorteValor: 100,
      golSulValor: 140,
      centralLesteValor: 180,
      centralOesteValor: 200,
      superiorNorteValor: 110,
      superiorSulValor: 110,
      superiorLesteValor: 120,
      superiorOesteValor: 120,
    },
    {
      id: "3",
      adversario: "Goias",
      dataJogo: "2023-09-15",
      golNorteValor: 100,
      golSulValor: 140,
      centralLesteValor: 180,
      centralOesteValor: 200,
      superiorNorteValor: 110,
      superiorSulValor: 110,
      superiorLesteValor: 120,
      superiorOesteValor: 120,
    },
  ];
}
