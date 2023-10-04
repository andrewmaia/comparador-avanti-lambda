## Infra como código para as funções Lambda

Este projeto contém funções AWS Lambda.
Para o deploy da funções Lambda através de código (Infra como código) foi utilizado o AWS SAM Cli. Para utilizar o SAM Cli é necessário:

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 18](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)


O SAM Cli gera a infraestrura como código no arquivo template.yaml.
O arquivo template.yaml é gerado através do  comando na raíz do repositório:

```bash
sam init 
```

Obs: Este comando já foi executado para este projeto, por isso o arquivo template.yaml já está no repositório.

## Deploy das funções Lambda de forma manual em uma conta AWS

O SAM Cli permite fazer o deploy da infra como código das funções lambda do arquivo template.yaml.
Para  fazer o deploy das funções lambda em um conta AWS é necessário que as credenciais aws já estejam configuradas através do comando:

```bash
aws configure
```

Depois rodar o build para gerar os arquivos que serão utilizados pelo SAM para criar a stack de recursos das funções lambda(Será criada uma pasta oculta chamada .aws-sam com os arquivos):
```bash
sam build 
```


A seguir rode o comando que irá criar a pilha de recursos no Cloudformation na conta AWS:
```bash
sam deploy --guided
```

Obs: o atributo --guided habilita o passo a passo e salva o que você selecionar em samconfig.toml, depois de salva as configurações não é mais necessário rodar o comando sam deploy com o atributo --guided

## Exclusão das funções Lambda  em uma conta AWS

Depois de feito o deploy e criada a stack de recursos das funções lambda é possível excluir essa stack através do comando:

```bash
sam delete
```
