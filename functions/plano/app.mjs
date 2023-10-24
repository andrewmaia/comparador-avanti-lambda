/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const planoTable = process.env.PlanoTable;

export const lambdaHandler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(await obterPlanos()),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export async function obterPlanos() {
  const command = new QueryCommand({
    TableName: planoTable,
    IndexName: "valorIndex",
    KeyConditionExpression: "statusPlano = :statusPlano",
    ExpressionAttributeValues: { ":statusPlano": "ok" },
  });

  const response = await docClient.send(command);
  return response.Items;
}
