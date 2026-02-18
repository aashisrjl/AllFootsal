const swaggerJsdoc = require("swagger-jsdoc");
const {SERVER_URL} = process.env;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AllFutsal API Documentation",
      version: "1.0.0",
      description: "API documentation for AllFutsal Backend",
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:3000",
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
  apis: ["./routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
