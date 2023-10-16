/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const jogoTable = process.env.JogoTable;
const planoTable = process.env.PlanoTable;

export const lambdaHandler = async (event, context) => {
  try {
    let planos =await obterPlanos();
    let params = event.body.split("&");
    params.forEach((keyAndValue) => {
      let keyValueArray = keyAndValue.split("=");
      let jogoId = keyValueArray[0];
      let setor = keyValueArray[1];
      if(setor!==""){
        planos.forEach(()=>{
          
        });
      }
    });
    //Para cada plano calcular o valor total gasto em jogos mais a mensalidade
    //Retornar os planos e o valor que gastaria com cada plano para ir nas mesmas partidas
    //Incluir sem plano
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(event),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

async function obterPlanos() {
  const command = new ScanCommand({
    ProjectionExpression:
      "centralLesteDesconto, centralOesteDesconto, golNorteDesconto, golSulDesconto, superiorDesconto, nome, valor",
    TableName: planoTable,
  });

  const response = await docClient.send(command);
  return response.Items;
}
