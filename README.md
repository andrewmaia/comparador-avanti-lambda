## Infra como código para as funções Lambda

Este projeto contém funções AWS Lambda.
Para o deploy da funções Lambda através de código (Infra como código) foi utilizado o AWS SAM Cli. Para utilizar o SAM Cli é necessário:

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 18](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)


O SAM Cli gera a infraestrura como código no arquivo template.yaml.
O arquivo template.yaml é gerado através do  comando:

```bash
sam init 
```

Obs: Este comando já foi executado para este projeto, por isso o arquivo template.yaml já está no repositório.

##Deploy das funções Lambda de forma manual em uma conta AWS

O Sam Cli permite fazer o deploy da infra como código das funções lambda do arquivo template.yaml.
Para  fazer o deploy das funções lambda em um conta AWS é necessário que as credenciais aws já estejam configuradas através do comando:

```bash
aws configure
```

Depois rodar o build para gerar os arquivos que serão utilizados pelo SAM para criar a stack de recursos das funções lambda no cloudformation:
```bash
sam build 
```
Será criada uma pasta oculta chamada .aws-sam com os arquivos

A seguir é rodado o comando que irá criar a pilha de recursos no Cloudformation:
```bash
sam deploy --guided
```

Obs: o atributo --guided habilita o passo a passo e salva o que você selecionar em samconfig.toml, depois de salva as configurações não é mais necessário rodar o comando sam deploy com o atributo --guided

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
comparador-avanti-lambda$ sam build
```

The SAM CLI installs dependencies defined in `hello-world/package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
comparador-avanti-lambda$ sam local invoke HelloWorldFunction --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
comparador-avanti-lambda$ sam local start-api
comparador-avanti-lambda$ curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

## Add a resource to your application
The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
comparador-avanti-lambda$ sam logs -n HelloWorldFunction --stack-name comparador-avanti-lambda --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests are defined in the `hello-world/tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run unit tests.

```bash
comparador-avanti-lambda$ cd hello-world
hello-world$ npm install
hello-world$ npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
sam delete --stack-name comparador-avanti-lambda
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
