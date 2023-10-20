/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

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
  const command = new QueryCommand({
    TableName: jogoTable,
    IndexName: "dataJogoIndex",
    KeyConditionExpression: "statusJogo = :statusJogo",
    ExpressionAttributeValues: { ":statusJogo": "ok" },
    ScanIndexForward: false,
    Limit: 5,
  });

  const response = await docClient.send(command);
  return response.Items;
}
