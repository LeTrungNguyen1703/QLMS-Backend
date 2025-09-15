import swaggerJsDoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QLMS API Documentation',
      version: '1.0.0',
      description: 'Quản Lý Mượn Sách API Documentation',
      contact: {
        name: 'Developer'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        APIResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: { type: 'object' }
          }
        },
        APIResponseError: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./Routers/*.ts', './Controllers/*.ts', './DTO/Request/*.ts', './DTO/Response/*.ts', './server.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
