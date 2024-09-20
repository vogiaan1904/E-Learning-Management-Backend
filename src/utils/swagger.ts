import { envConfig } from "@/configs";
import swaggerJsdoc from "swagger-jsdoc";

const serverUrl = `localhost:${envConfig.PORT}${envConfig.APIS}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: `${envConfig.NAME} API Documentation`,
      description: `This is the API Docs for using internally. Base URL: [${serverUrl}](${serverUrl})`,
      termsOfService: "http://swagger.io/terms/",
      license: {
        name: "Apache License, Version 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
      version: "1.0.0",
    },
    externalDocs: {
      description: "Find out more about Swagger",
      url: "http://swagger.io",
    },
    servers: [
      {
        url: `http://${serverUrl}`,
        description: "Development server",
      },
    ],
    tags: [
      { description: "All APIs to interact with auth", name: "Auth" },
      { description: "All APIs to interact with users", name: "Users" },
      {
        description: "All APIs to interact with services",
        name: "Services",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/docs/swagger/**/*.yaml"],
};

export const swaggerSpec = swaggerJsdoc(options);