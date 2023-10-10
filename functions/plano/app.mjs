/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.PlanoTable;

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
  const command = new GetCommand({
    TableName: "AngryAnimals",
  });

  const response = await docClient.send(command);  
  return response;

  return {
    planos: [
      {
        nome: "Plano Bronze",
        valor: "17,99",
        centralOesteDesconto: 0,
        centralLesteDesconto: 0,
        golNorteDesconto: 0,
        golSulDesconto: 0,
        superiorDesconto: 20,
      },
      {
        nome: "Plano Prata",
        valor: "41,99",
        centralOesteDesconto: 0,
        centralLesteDesconto: 25,
        golNorteDesconto: 50,
        golSulDesconto: 50,
        superiorDesconto: 50,
      },
    ],
  };
}
