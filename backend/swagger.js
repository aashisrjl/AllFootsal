const swaggerAutogen = require('swagger-autogen')();
const {SERVER_PORT}=process.env

const doc = {
  info: {
    title: 'AllFutsal API',
    description: 'Automatically generated API documentation',
  },
  host: SERVER_PORT,
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter JWT token',
    },
  },
};


const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; // main entry file

swaggerAutogen(outputFile, endpointsFiles, doc);
