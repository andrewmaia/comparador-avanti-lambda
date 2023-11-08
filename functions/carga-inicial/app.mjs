/** @format */
import { DynamoDBClient, waitUntilTableExists } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import * as url from "url";
import * as https from "https";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const planoTable = process.env.PlanoTable;
const jogoTable = process.env.JogoTable;

/*Depois que é feita a carga é necessário fazer uma chamada HTTP para o cloudformation
  para avisar que a carga foi finalizada. Se não realizar a chamada a stack fica paralisada.
*/

export const lambdaHandler = async (event, context) => {
  console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));
  try {
    await carregarPlanos();
    await carregarJogos();
    await sendResponse(event, context, "SUCCESS");
  } catch (error) {
    console.log(error);
    await sendResponse(event, context, "FAILED");
  }
};

// Send response to the pre-signed S3 URL
async function sendResponse(event, context, responseStatus) {
  var responseBody = JSON.stringify({
    Status: responseStatus,
    Reason:
      "See the details in CloudWatch Log Stream: " + context.logStreamName,
    PhysicalResourceId: context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: { cargaFeita: responseStatus },
  });

  console.log("RESPONSE BODY:\n", responseBody);

  var parsedUrl = url.parse(event.ResponseURL);
  var options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: "PUT",
    headers: {
      "content-type": "",
      "content-length": responseBody.length,
    },
  };

  console.log("SENDING RESPONSE...\n");

  /*Tem que 'envelopar' a chamada  http numa promise para poder aguardar a finalização da 
    chamada http. Se não a função lambda é encerrada e finaliza a chamada http antes de
    terminar.
  */
  await new Promise(function (resolve, reject) {
    var request = https.request(options, function (response) {
      console.log("STATUS: " + response.statusCode);
      console.log("HEADERS: " + JSON.stringify(response.headers));
      // Tell AWS Lambda that the function execution is done
      context.done();
    });

    request.on("error", function (error) {
      console.log("sendResponse Error:" + error);
      // Tell AWS Lambda that the function execution is done
      context.done();
    });

    // write data to request body
    request.write(responseBody);
    request.end();
  });
}

async function carregarPlanos() {
  await waitUntilTableExists(
    { client: client, maxWaitTime: 120 },
    { TableName: planoTable }
  );

  const command = new BatchWriteCommand({
    RequestItems: {
      [planoTable]: [
        {
          PutRequest: {
            Item: {
              id: "1",
              nome: "Plano Verde",
              valor: 9.99,
              centralOesteDesconto: 0,
              centralLesteDesconto: 0,
              golSulDesconto: 0,
              golNorteDesconto: 0,
              superiorDesconto: 0,
              statusPlano: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "2",
              nome: "Plano Bronze",
              valor: 17.99,
              centralOesteDesconto: 0,
              centralLesteDesconto: 0,
              golSulDesconto: 0,
              golNorteDesconto: 0,
              superiorDesconto: 20,
              statusPlano: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "3",
              nome: "Plano Especial",
              valor: 20.99,
              centralOesteDesconto: 0,
              centralLesteDesconto: 25,
              golSulDesconto: 50,
              golNorteDesconto: 50,
              superiorDesconto: 50,
              statusPlano: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "4",
              nome: "Plano Prata",
              valor: 41.99,
              centralOesteDesconto: 0,
              centralLesteDesconto: 25,
              golSulDesconto: 50,
              golNorteDesconto: 50,
              superiorDesconto: 50,
              statusPlano: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "5",
              nome: "Prata Superior",
              valor: 77.99,
              centralOesteDesconto: 0,
              centralLesteDesconto: 25,
              golSulDesconto: 50,
              golNorteDesconto: 50,
              superiorDesconto: 75,
              statusPlano: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "6",
              nome: "Plano Ouro",
              valor: 144.99,
              centralOesteDesconto: 25,
              centralLesteDesconto: 50,
              golSulDesconto: 75,
              golNorteDesconto: 100,
              superiorDesconto: 75,
              statusPlano: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "7",
              nome: "Plano Platina",
              valor: 259.99,
              centralOesteDesconto: 50,
              centralLesteDesconto: 75,
              golSulDesconto: 100,
              golNorteDesconto: 100,
              superiorDesconto: 100,
              statusPlano: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "8",
              nome: "Plano Diamante",
              valor: 779.99,
              centralOesteDesconto: 100,
              centralLesteDesconto: 100,
              golSulDesconto: 100,
              golNorteDesconto: 100,
              superiorDesconto: 100,
              statusPlano: "ok",
            },
          },
        },
      ],
    },
  });

  await docClient.send(command);
}

async function carregarJogos() {
  await waitUntilTableExists(
    { client: client, maxWaitTime: 120 },
    { TableName: jogoTable }
  );

  const command = new BatchWriteCommand({
    RequestItems: {
      [jogoTable]: [
        {
          PutRequest: {
            Item: {
              id: "1",
              adversario: "Atlético Mineiro",
              dataJogo: "2023-10-19",
              AllianzParque: true,
              setores: [
                {
                  setorNome: "Gol Norte",
                  valorIngresso: 100,
                },
                {
                  setorNome: "Gol Sul",
                  valorIngresso: 140,
                },
                {
                  setorNome: "Central Leste",
                  valorIngresso: 180,
                },
                {
                  setorNome: "Central Oeste",
                  valorIngresso: 200,
                },
                {
                  setorNome: "Superior Norte",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Sul",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Leste",
                  valorIngresso: 120,
                },
                {
                  setorNome: "Superior Oeste",
                  valorIngresso: 120,
                },
              ],

              statusJogo: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "2",
              adversario: "Boca Juniors",
              dataJogo: "2023-10-05",
              AllianzParque: true,
              setores: [
                {
                  setorNome: "Gol Norte",
                  valorIngresso: 240,
                },
                {
                  setorNome: "Gol Sul",
                  valorIngresso: 360,
                },
                {
                  setorNome: "Central Leste",
                  valorIngresso: 480,
                },
                {
                  setorNome: "Central Oeste",
                  valorIngresso: 500,
                },
                {
                  setorNome: "Superior Norte",
                  valorIngresso: 300,
                },
                {
                  setorNome: "Superior Sul",
                  valorIngresso: 300,
                },
                {
                  setorNome: "Superior Leste",
                  valorIngresso: 340,
                },
                {
                  setorNome: "Superior Oeste",
                  valorIngresso: 340,
                },
              ],
              statusJogo: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "3",
              adversario: "Goias",
              dataJogo: "2023-09-15",
              AllianzParque: true,
              setores: [
                {
                  setorNome: "Gol Norte",
                  valorIngresso: 100,
                },
                {
                  setorNome: "Gol Sul",
                  valorIngresso: 140,
                },
                {
                  setorNome: "Central Leste",
                  valorIngresso: 180,
                },
                {
                  setorNome: "Central Oeste",
                  valorIngresso: 200,
                },
                {
                  setorNome: "Superior Norte",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Sul",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Leste",
                  valorIngresso: 120,
                },
                {
                  setorNome: "Superior Oeste",
                  valorIngresso: 120,
                },
              ],
              statusJogo: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "4",
              adversario: "Vasco",
              dataJogo: "2023-08-27",
              AllianzParque: true,
              setores: [
                {
                  setorNome: "Gol Norte",
                  valorIngresso: 100,
                },
                {
                  setorNome: "Gol Sul",
                  valorIngresso: 140,
                },
                {
                  setorNome: "Central Leste",
                  valorIngresso: 180,
                },
                {
                  setorNome: "Central Oeste",
                  valorIngresso: 200,
                },
                {
                  setorNome: "Superior Norte",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Sul",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Leste",
                  valorIngresso: 120,
                },
                {
                  setorNome: "Superior Oeste",
                  valorIngresso: 120,
                },
              ],
              statusJogo: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "5",
              adversario: "São Paulo",
              dataJogo: "2023-10-25",
              AllianzParque: true,
              setores: [
                {
                  setorNome: "Gol Norte",
                  valorIngresso: 100,
                },
                {
                  setorNome: "Gol Sul",
                  valorIngresso: 140,
                },
                {
                  setorNome: "Central Leste",
                  valorIngresso: 180,
                },
                {
                  setorNome: "Central Oeste",
                  valorIngresso: 200,
                },
                {
                  setorNome: "Superior Norte",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Sul",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Leste",
                  valorIngresso: 120,
                },
                {
                  setorNome: "Superior Oeste",
                  valorIngresso: 120,
                },
              ],
              statusJogo: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "6",
              adversario: "Bahia",
              dataJogo: "2023-10-28",
              AllianzParque: true,
              setores: [
                {
                  setorNome: "Gol Norte",
                  valorIngresso: 100,
                },
                {
                  setorNome: "Gol Sul",
                  valorIngresso: 140,
                },
                {
                  setorNome: "Central Leste",
                  valorIngresso: 180,
                },
                {
                  setorNome: "Central Oeste",
                  valorIngresso: 200,
                },
                {
                  setorNome: "Superior Norte",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Sul",
                  valorIngresso: 110,
                },
                {
                  setorNome: "Superior Leste",
                  valorIngresso: 120,
                },
                {
                  setorNome: "Superior Oeste",
                  valorIngresso: 120,
                },
              ],
              statusJogo: "ok",
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "7",
              adversario: "Atlético Paranaense",
              dataJogo: "2023-11-04",
              AllianzParque: false,
              nomeEstadio: "Arena Barueri",
              setores: [
                {
                  setorNome: "Setor A",
                  valorIngresso: 200,
                  Bronze: 160,
                  Prata: 100,
                  "Prata Superior": 50,
                  Ouro: 50,
                  Platina: 0,
                  Diamante: 0,
                },
                {
                  setorNome: "Setor A1",
                  valorIngresso: 160,
                  Bronze: 160,
                  Prata: 160,
                  "Prata Superior": 160,
                  Ouro: 120,
                  Platina: 80,
                  Diamante: 0,
                },
                {
                  setorNome: "Setor B",
                  valorIngresso: 80,
                  Bronze: 80,
                  Prata: 40,
                  "Prata Superior": 40,
                  Ouro: 0,
                  Platina: 0,
                  Diamante: 0,
                },
                {
                  setorNome: "Setor C",
                  valorIngresso: 100,
                  Bronze: 80,
                  Prata: 50,
                  "Prata Superior": 25,
                  Ouro: 25,
                  Platina: 0,
                  Diamante: 0,
                },
                {
                  setorNome: "Setor C1",
                  valorIngresso: 120,
                  Bronze: 120,
                  Prata: 90,
                  "Prata Superior": 90,
                  Ouro: 60,
                  Platina: 30,
                  Diamante: 0,
                },
                {
                  setorNome: "Setor D1",
                  valorIngresso: 100,
                  Bronze: 100,
                  Prata: 50,
                  "Prata Superior": 50,
                  Ouro: 25,
                  Platina: 0,
                  Diamante: 0,
                },
              ],
              statusJogo: "ok",
            },
          },
        },
      ],
    },
  });

  await docClient.send(command);
}
