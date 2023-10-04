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

## Deploy automático de infra e código através de Pipeline

SAM Cli permite criar uma pipeline que automatiza todo o processo de deploy para que não seja necessário rodar os comandos sam build e sam deploy manualmente. Para criar a pipeline, rode o comando: 

```bash
sam pipeline init --bootstrap 
```

O comando acima irá iniciar um passo a passo para gerar um arquivo de infra como código para gerar uma pipeline na AWS. Ao final do processo é criado o arquivo de infra como código chamado **codepipeline.yaml**.

Também é criado uma pasta chamada pipeline onde está os arquivos com os comandos que os projetos do codebuild da pipeline irão rodar.

Depois é necessário comitar esses arquivos no repositório.

Obs: Novamente repare que esses arquivos já estão presentes no repositório porque o comando sam pipeline init já foi rodado para este projeto.  

Depois rode o comando abaixo para criar a stack da pipeline:

```bash
sam deploy -t codepipeline.yaml --stack-name comparador-avanti-lambda-pipeline --capabilities=CAPABILITY_IAM
```

Depois de criada a stack da pipeline, qualquer alteração no código  feitas no repositório das funções lambda e no código de infra do pipeline serão automáticamente atualizadas na AWS. Isso mesmo: A pipeline é capaz de se auto-atualizar.

Importante: A primeira vez que a pipeline rodar ela irá falhar no primeiro estágio. É necessário entrar manualmente no primeiro estágio e finalizar a configuração da conexão com o GITHUB.

## Como funciona a pipeline criada?

O código como infra gerado em codepipeline.yaml ira gerar uma pipeline com os seguintes estágios:

**Estágio 1 - Detecção de alterações no Repositório:** Qualquer commit feito no repositório irá iniciar a pipeline automaticamente.

**Estágio 2 - Atualização da Pipeline:** É neste estágio que ocorre a **auto-atualização da pipeline**. Aqui são executadas ações que irão pegar o conteudo do arquivo **codepipeline.yaml**  e republicar a stack que gera a pipeline. Assim qualquer alteração nesse arquivo resultará numa auto-atualização da pipeline.

**Estágio 3 - Rodar Unit Tests:** Neste estágio é executado o projeto de codebuild que roda os testes através do arquivo **buildspec_unit_test.yml** da pasta pipeline.

**Estágio 4 - Gerar pacotes de publicação:** Neste estágio é executado o projeto de codebuild que gera os pacotes com a stacks das funções lambda a serem publicadas  através do arquivo **buildspec_build_package.yml** da pasta pipeline.

**Estágio 5 - Publicar em Dev:** Neste estágio é executado o projeto de codebuild que publica na stack de dev as funções lambda através do arquivo **buildspec_deploy.yml** da pasta pipeline.

**Estágio 6 - Publicar em Prod:** Neste estágio é executado o projeto de codebuild que publica na stack de prod as funções lambda através do arquivo **buildspec_deploy.yml** da pasta pipeline.

Obs: Os estágios 5 e 6 utilizam o mesmo projeto de codebuild para publicar as stacks de dev e prod. O projeto consegue publicar em stacks diferentes porque utiliza variáveis de ambiente para cada estágio.

Obs2: No arquivo codepipeline.yaml é definido mais alguns projetos de build que não são publicados na pipeline porque estão comentados (no caso do integration test) ou porque há algumas condições no código que só permitem criar o projeto quando determinadas variáveis estão setadas ( no caso do BuildAndDeployFeatureStack).

