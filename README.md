# Express Typescript Template - Backend

## 0. Content

- [Brief description](#1-brief-description)
- [Language and Tools](#2-language-and-tools)
- [Routes and Services](#3-routes-and-services)
  - [Routes](#31-routes)
  - [Services](#32-services)
- [Before starting the server](#4-before-starting-the-server)
  - Environment configuration
- [Starting the server](#5-starting-the-server)
  - Command table

## 1. Brief description

- This is a backend code for E Learning Management - Software Engineer Project.

## 2. Language and Tools

![Express](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=fff&style=flat)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=flat)
![ts-node](https://img.shields.io/badge/ts--node-3178C6?logo=tsnode&logoColor=fff&style=flat)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff&style=flat)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=fff&style=flat)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=flat)
![nvm](https://img.shields.io/badge/nvm-F4DD4B?logo=nvm&logoColor=000&style=flat)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff&style=flat)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=flat)
![JSON Web Tokens](https://img.shields.io/badge/JSON%20Web%20Tokens-000?logo=jsonwebtokens&logoColor=fff&style=flat)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=000&style=flat)
![.ENV](https://img.shields.io/badge/.ENV-ECD53F?logo=dotenv&logoColor=000&style=flat)

## 3. Routes and Services

### 3.1 Routes

- For more details, access the Swagger document in `localhost:{PORT}/docs`

#### Auth routes

- GET `auth/api-status`: Get auth apis status
- POST `auth/signin`: User sign in
- POST `auth/signup`: User sign up
- POST `auth/validation/send`: Send activation code
- POST `auth/validation/verify`: Verify activation code

### 3.2 Services

## 4. Before starting the server

- Install dependencies by yarn commands

```cmd
  yarn / yarn install / npm install
```

or commands in `package.json` file

```cmd
  npm run / yarn reset
```

- Run Docker command in `package.json` file

```cmd
  npm run / yarn docker:dev
```

- Set up the .env file before starting the server (you can check the `default environment variables` in [env.config.ts](./src/configs/env.config.ts))

```
  # Server
  PORT= # port server running on (default: 3000)
  APIS= # api url (default: /api/v1)

  # Secret tokens
  ACCESS_TOKEN_SECRET=
  ACCESS_TOKEN_EXPIRED=
  REFRESH_TOKEN_SECRET=
  REFRESH_TOKEN_EXPIRED=

  # Database (PostgreSQL)
  POSTGRES_HOST=
  POSTGRES_PORT=
  POSTGRES_USER=
  POSTGRES_PASSWORD=
  POSTGRES_DB=
  DATABASE_URL=

  # Database Admin (PgAdmin)
  PGADMIN_DEFAULT_EMAIL=
  PGADMIN_DEFAULT_PASSWORD=

  # Email Service
  NODEMAILER_USER= # email for sender (default: my email)
  NODEMAILER_PASS= # password for sender (default: my email password/key)
```

## 5. Starting the server

- Output: (default port: 3000)

```bash
  2024-09-20 21:36:40PM] 41687f33-5571-46b6-a54f-a95ed6946a9d E Learning Management Backend - info :     Running database prescript
[2024-09-20 21:36:40PM] 2347e59e-81df-460b-8838-18f0fc4cd026 E Learning Management Backend - info :     Server is running on http://localhost:8000
[2024-09-20 21:36:40PM] d4cedb26-ff4d-4e9a-b5ad-d7a8479858b2 E Learning Management Backend - info :     Swagger Docs is avaliable at http://localhost:8000/docs
[2024-09-20 21:36:40PM] 7e86f822-7ac5-49a0-87c0-095a579a1b86 E Learning Management Backend - info :     E Learning Management database is connected
```

- Commands table in `package.json` file

| command               | description                                             |
| --------------------- | ------------------------------------------------------- |
| `yarn start:dev`      | Runing the server in development mode with no debugging |
| `yarn start:debug`    | Runing the server in development mode with debugging    |
| `yarn start:prod`     | Runing the server in production mode                    |
| `yarn prebuild`       | Cleaning dist/build folder before building production   |
| `yarn build`          | Building production                                     |
| `yarn reset`          | Cleaning dependencies and reinstall it                  |
| `yarn lint`           | Checking eslint styles                                  |
| `yarn lint:fix`       | Formatting code with eslint styles                      |
| `yarn prettier`       | Checking prettier styles                                |
| `yarn prettier:fix`   | Formatting code with prettier styles                    |
| `yarn docker:dev`     | Docker compose up the development containers            |
| `yarn docker:prod`    | Docker compose up the production containers             |
| `yarn docker:remove`  | Docker compose down the database conatainer             |
| `yarn docker:create`  | Docker compose up the database container                |
| `yarn docker:restart` | `yarn docker:remove & docker:create`                    |
