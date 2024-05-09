# Configuração do Projeto Node.js com Express

Este guia fornece instruções passo a passo para configurar e executar o projeto Node.js usando Express.

## Pré-requisitos

- Node.js instalado
- NPM (Node Package Manager) instalado
- MySQL Workbench instalado
- Criar o banco de dados no MySQL Workbench para que o prisma gere as tabelas corretamente

## Instalação

Clone o repositório do projeto e instale as dependências:

```bash
git clone byron-shop
cd byron-shop
npm install
```

## Configuração do Banco de Dados

Execute as migrações do Prisma para configurar o banco de dados:

```bash
npx prisma migrate dev
```

## Variáveis de Ambiente

Crie um arquivo \`.env\` na raiz do seu projeto e adicione as seguintes variáveis de ambiente com valores fictícios:

```plaintext
APP_PORT='8080'
HOST='localhost'
DATABASE_URL='mysql://usuario:senha@localhost:3306/nome_do_banco?schema=public'
JWT_SECRET='SUA_CHAVE_SECRETA'
```

Certifique-se de substituir `usuario`, `senha`, `nome_do_banco` e `SUA_CHAVE_SECRETA` pelos valores apropriados para o seu ambiente.

## Execução

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

## Documentação da API com Swagger

Para acessar a documentação da API gerada pelo Swagger, visite:

```
http://localhost:porta/api-docs
```

Substitua `porta` pelo número da porta configurado na variável `APP_PORT` do seu arquivo `.env`.
