/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const jogoTable = process.env.JogoTable;

export const lambdaHandler = async (event, context) => {
  try {
    let lastEvaluatedKey;
    if (event.body !== null) lastEvaluatedKey = JSON.parse(event.body);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(await obterJogos(6, lastEvaluatedKey)),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export async function obterJogos(limit, exclusiveStartKey) {
  const command = new QueryCommand({
    TableName: jogoTable,
    IndexName: "dataJogoIndex",
    KeyConditionExpression: "statusJogo = :statusJogo",
    ExpressionAttributeValues: { ":statusJogo": "ok" },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
  });

  const response = await docClient.send(command);

  return {
    Items: response.Items,
    LastEvaluatedKey: response.LastEvaluatedKey,
  };
}
