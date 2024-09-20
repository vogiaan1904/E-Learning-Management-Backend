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

<img src="https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=flat" alt="Express Badge">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat" alt="TypeScript Badge">
<img src="https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=fff&style=flat" alt="Yarn Badge">
<img src="https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=flat" alt="Node.js Badge">
<img src="https://img.shields.io/badge/ts--node-3178C6?logo=tsnode&logoColor=fff&style=flat" alt="ts-node Badge">
<img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff&style=flat" alt="ESLint Badge">
<img src="https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=fff&style=flat" alt="Prettier Badge">
<img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=flat" alt="Docker Badge">
<img src="https://img.shields.io/badge/nvm-F4DD4B?logo=nvm&logoColor=000&style=flat" alt="nvm Badge">
<img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff&style=flat" alt="Prisma Badge">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=flat" alt="PostgreSQL Badge">
<img src="https://img.shields.io/badge/JSON%20Web%20Tokens-000?logo=jsonwebtokens&logoColor=fff&style=flat" alt="JSON Web Tokens Badge">
<img src="https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=000&style=flat" alt="Swagger Badge">
<img src="https://img.shields.io/badge/.ENV-ECD53F?logo=dotenv&logoColor=000&style=flat" alt=".ENV Badge">

## 3. Routes and Services

### 3.1 Routes

- For more details, access the Swagger document in `localhost:{PORT}/docs`

#### Auth routes

- GET `auth/api-status`: Get auth apis status
- POST `auth/signin`: User sign in
- POST `auth/signup`: User sign up
- POST `auth/validation/send`: Send activation code
- POST `auth/validation/verify`: Verify activation code

#### User routes

- GET `users/api-status`: Get user apis status
- GET `users`: Get users
- POST `users`: Create users
- PATCH `users/many`: Update users
- DELETE `users/many`: Delete users
- GET `users/{id}`: Get user by id
- PATCH `users/{id}`: Update user by id
- DELETE`users/{id}`: Delete user by id

### 3.2 Services

## 4. Before starting the server

- Install dependencies by yarn commands

```cmd
  yarn / yarn install
```

or commands in `package.json` file

```cmd
  yarn reset
```

- Run Docker command in `package.json` file

```cmd
  yarn docker:dev
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

- Commands table in `package.json` file

| command               | description                                             |
| --------------------- | ------------------------------------------------------- |
| `yarn start:dev`      | Runing the server in development mode with no debugging |
| `yarn start:debug`    | Runing the server in development mode with debugging    |
| `yarn start:dev`      | Runing the server in production mode                    |
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
