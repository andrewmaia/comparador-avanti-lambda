/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const jogoTable = process.env.JogoTable;
const planoTable = process.env.PlanoTable;

export const lambdaHandler = async (event, context) => {
  try {
    let planos = await obterPlanos();
    let jogos = await obterJogos();
    const planosComparados = comparar(event.body, planos, jogos);
    console.log(JSON.stringify(planosComparados));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(planosComparados),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

function comparar(body, planos, jogos) {
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
  params.forEach((keyAndValue) => {
    let keyValueArray = keyAndValue.split("=");
    let jogoId = keyValueArray[0];
    let setor = keyValueArray[1];

    if (setor === "")
      //Não foi no jogo
      return;

    let jogo = jogos.find((jogo) => jogo.id === jogoId);

    planos.forEach((plano) => {
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

      if (!planosComparados.has(plano.id)) {
        planosComparados.set(plano.id, {
          planoId: plano.id,
          planoNome: plano.nome,
          planoValor: plano.valor,
          valorMensalidadePeriodo: 0,
          valorTotal: 0,
          jogos: [],
        });
      }

      const planoComparado = planosComparados.get(plano.id);
      planoComparado.jogos.push({
        jogoId: jogo.id,
        jogoAdversario: jogo.adversario,
        jogoData: jogo.dataJogo,
        setorComprado: setor,
        valorIngresso: valorIngresso,
      });

      //console.log(`Plano:${plano.nome}. Valor ingresso:${valorIngresso}`);
    });
  });

  const p = [];
  planosComparados.forEach(function (plano, planoId) {
    plano.jogos.sort((a, b) => {
      return new Date(a.jogoData) - new Date(b.jogoData);
    });

    const jogoMaisAntigo = plano.jogos[0];
    const jogoMaisRecente = plano.jogos[plano.jogos.length - 1];

    const meses = monthDiff(jogoMaisAntigo.jogoData, jogoMaisRecente.jogoData);
    plano.valorMensalidadePeriodo = plano.planoValor * meses;
    const valorJogos = plano.jogos.reduce((total, jogo) => {
      return { valorIngresso: total.valorIngresso + jogo.valorIngresso };
    }).valorIngresso;
    plano.valorTotal = plano.valorMensalidadePeriodo + valorJogos;
    p.push(plano);
  });

  return p;
}

async function obterPlanos() {
  const command = new ScanCommand({
    ProjectionExpression:
      "id, centralLesteDesconto, centralOesteDesconto, golNorteDesconto, golSulDesconto, superiorDesconto, nome, valor",
    TableName: planoTable,
  });

  const response = await docClient.send(command);
  return response.Items;
}

async function obterJogos() {
  const command = new ScanCommand({
    ProjectionExpression:
      "id, adversario, dataJogo, centralOesteValor, centralLesteValor, golNorteValor, golSulValor, superiorNorteValor, superiorSulValor, superiorOesteValor, superiorLesteValor",
    TableName: jogoTable,
  });

  const response = await docClient.send(command);
  return response.Items;
}

function monthDiff(d1s, d2s) {
  const d1 = new Date(d1s);
  const d2 = new Date(d2s);

  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}
