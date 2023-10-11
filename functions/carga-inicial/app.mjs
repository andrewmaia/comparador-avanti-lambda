/** @format */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const planoTable = process.env.PlanoTable;

export const lambdaHandler = async (event, context) => {
    const responseData = { Result: 'Items added successfully' };
    await response.send(event, context, response.SUCCESS, responseData);
};




