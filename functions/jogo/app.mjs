/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const jogoTable = process.env.JogoTable;

export const lambdaHandler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(await obterJogos()),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export async function obterJogos() {
  const command = new ScanCommand({
    ProjectionExpression:
      "id, adversario, dataJogo, centralOesteValor, centralLesteValor, golNorteValor, golSulValor, superiorNorteValor, superiorSulValor, superiorOesteValor, superiorLesteValor",
    TableName: jogoTable,
  });

  const response = await docClient.send(command);
  return response.Items;
}
