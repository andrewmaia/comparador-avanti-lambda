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

/*Depois que é feita a carga é necessário fazer uma chamada HTTP para o cloudformation
  para avisar que a carga foi finalizada. Se não realizar a chamada a stack fica paralisada.
*/

export const lambdaHandler = async (event, context) => {
  console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));
  try {
    await carregarPlanos();
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

  /*Tem 'envelopar' a chamada a http numa promise para poder aguardar a finalização da 
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
              nome: "Plano Bronze",
              valor: "17,99",
              centralOesteDesconto: 0,
              centralLesteDesconto: 0,
              golNorteDesconto: 0,
              golSulDesconto: 0,
              superiorDesconto: 20,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              id: "2",
              nome: "Plano Prata",
              valor: "41,99",
              centralOesteDesconto: 0,
              centralLesteDesconto: 25,
              golNorteDesconto: 50,
              golSulDesconto: 50,
              superiorDesconto: 50,
            },
          },
        },
      ],
    },
  });

  await docClient.send(command);
}
