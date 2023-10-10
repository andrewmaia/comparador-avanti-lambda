/** @format */

//Verificar o IAM Execution Role da funcao lamda para ela ter acesso ao DynamoDB

//Usar variavel de ambiente para escrever no DynamoDB https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html

/*
Para rodar localmente:
npm install
sam local start-api --port 8080
*/

export const lambdaHandler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(await obterPlanos()),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

async function obterPlanos() {
  return {
    planos: [
      {
        nome: "Plano Bronze",
        valor: 17.99,
        centralOesteDesconto: 0,
        centralLesteDesconto: 0,
        golNorteDesconto: 0,
        golSulDesconto: 0,
        superior: 0.2,
      },
      {
        nome: "Plano Prata",
        valor: 41.99,
        centralOesteDesconto: 0,
        centralLesteDesconto: 0.25,
        golNorteDesconto: 0.5,
        golSulDesconto: 0.5,
        superior: 0.5,
      },
    ],
  };
}
