/** @format */
import { DynamoDBClient, waitUntilTableExists } from "@aws-sdk/client-dynamodb";
import {  BatchWriteCommand,  DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const planoTable = process.env.PlanoTable;

export const lambdaHandler = async (event, context) => {
  console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));
  try{

    sendResponse(event,context,"SUCCESS");

  } catch (error) {
    console.log(error);
    sendResponse(event,context,"FAILED");
  }
};

// Send response to the pre-signed S3 URL
function sendResponse(event, context,responseStatus) {
  var responseBody = JSON.stringify({
    Status: responseStatus,
    Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
    PhysicalResourceId: context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseStatus
  });

  console.log("RESPONSE BODY:\n", responseBody);

  var https = require("https");
  var url = require("url");

  var parsedUrl = url.parse(event.ResponseURL);
  var options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: "PUT",
    headers: {
        "content-type": "",
        "content-length": responseBody.length
    }
  };

  console.log("SENDING RESPONSE...\n");

  var request = https.request(options, function(response) {
    console.log("STATUS: " + response.statusCode);
    console.log("HEADERS: " + JSON.stringify(response.headers));
    // Tell AWS Lambda that the function execution is done  
    context.done();
  });

  request.on("error", function(error) {
    console.log("sendResponse Error:" + error);
    // Tell AWS Lambda that the function execution is done  
    context.done();
  });

  // write data to request body
  request.write(responseBody);
  request.end();
}



async function carregarPlanos(){
  await waitUntilTableExists({client: client, maxWaitTime: 120}, {TableName: planoTable})

  const command = new BatchWriteCommand({
      RequestItems: {
        [planoTable]: [
          {
              PutRequest: { 
                  Item: { 
                      id:"1",
                      nome: "Plano Bronze",
                      valor: "17,99",
                      centralOesteDesconto: 0,
                      centralLesteDesconto: 0,
                      golNorteDesconto: 0,
                      golSulDesconto: 0,
                      superiorDesconto: 20
                  }
              } 
           },
           {
              PutRequest: { 
                  Item: { 
                      id:"2",                      
                      nome: "Plano Prata",
                      valor: "41,99",
                      centralOesteDesconto: 0,
                      centralLesteDesconto: 25,
                      golNorteDesconto: 50,
                      golSulDesconto: 50,
                      superiorDesconto: 50
                  }
               }
          }            
        ],
      },
  });

  await docClient.send(command);
}



/*
    const command = new PutCommand({
        TableName: planoTable,
        Item: {
            CommonName: "Shiba Inu",
        },
    });
    const response = await docClient.send(command);
    console.log(response);    


import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async () => {
  const command = new PutCommand({
    TableName: "HappyAnimals",
    Item: {
      CommonName: "Shiba Inu",
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
};


*/

/*const AWS = require('aws-sdk');
const response = require('cfn-response');
const client = new AWS.DynamoDB();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const tableName = process.env.tableName
    console.log(tableName)
    var params = {
      'TableName': tableName
    };
  
    client.waitFor('tableExists', params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });

    const itemsToAdd = [
      { pk: 'item1', sk: 'sortKey1', otherAttribute: 'value1' },
      { pk: 'item2', sk: 'sortKey2', otherAttribute: 'value2' },
      { pk: 'item3', sk: 'sortKey3', otherAttribute: 'value3' },
      { pk: 'item4', sk: 'sortKey4', otherAttribute: 'value4' },
      { pk: 'item5', sk: 'sortKey5', otherAttribute: 'value5' },
    ];
    
    const putItemPromises = itemsToAdd.map((item) => {
      const params = {
        TableName: tableName,
        Item: item,
      };
      return dynamodb.put(params).promise();
    });
    
    await Promise.all(putItemPromises).then(res=>console.log(res)).catch(err=>console.log(err))
    
    const responseData = { Result: 'Items added successfully' };
    await response.send(event, context, response.SUCCESS, responseData);
  } catch (error) {
    console.log(error)
    const responseData = { Error: 'Something went wrong' };
    await response.send(event, context, response.FAILED, responseData);
  }
};*/