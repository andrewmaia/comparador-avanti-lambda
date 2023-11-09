/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { comparar } from "./comparador.mjs";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const jogoTable = process.env.JogoTable;
const planoTable = process.env.PlanoTable;

export const lambdaHandler = async (event, context) => {
  try {
    let planos = await obterPlanos();
    let jogos = await obterJogos();
    const planosComparados = comparar(event.body, planos, jogos);

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

async function obterPlanos() {
  const command = new ScanCommand({
    ProjectionExpression: "id, nome, valor, setoresDesconto",
    TableName: planoTable,
  });

  const response = await docClient.send(command);
  return response.Items;
}

async function obterJogos() {
  const command = new ScanCommand({
    ProjectionExpression:
      "id, adversario, dataJogo, allianzParque,nomeEstadio, setores",
    TableName: jogoTable,
  });

  const response = await docClient.send(command);
  return response.Items;
}
