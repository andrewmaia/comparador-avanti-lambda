/** @format */
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({});
const sugestaoProblemasTopic = process.env.SugestaoProblemasTopic;

export const lambdaHandler = async (event) => {
  try {
    console.log(sugestaoProblemasTopic);
    const response = await snsClient.send(
      new PublishCommand({
        Message: event.body,
        TopicArn: sugestaoProblemasTopic,
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
