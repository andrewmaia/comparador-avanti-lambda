/** @format */

const tableName = process.env.PlanoTable;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();


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
  const params = {
    TableName : tableName
  };
  const data = await docClient.scan(params).promise();
  return data.Items;  
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
