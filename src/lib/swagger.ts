import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Connectivity API',
      version: '1.0.0',
    },
    servers: [{ url: process.env.SERVER_URL ?? "http://localhost:3000" }],
  },
  apis: [path.resolve(__dirname, '../routes/**/*.ts')],
});
