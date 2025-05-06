import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Challenge',
      version: '1.0.0',
      description: 'Documentation generated with Swagger'
    },
    servers: [
      {
        url: 'http://localhost:3001'
      }
    ],
    components: {
      schemas: {
        Drug: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'UUID',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
            },
            drug_name: {
              type: 'string',
              description: 'Drug name',
              example: 'Dupixent'
            },
            indication: {
              type: 'string',
              description: 'Indication and Usage',
              example: 'Lorem Ipsum...'
            },
            icd10_code: {
              type: 'string',
              description: 'Corresponding ICD-10 code for Indication and Usage',
              example: 'L20.9'
            },
          },
          required: ['drug_name', 'indication', 'icd10_code']
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'UUID',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
            },
            name: {
              type: 'string',
              description: 'User name',
              example: 'John'
            },
            email: {
              type: 'string',
              description: 'User email',
              example: 'john.lennon@yahoo.com'
            },
            password: {
              type: 'string',
              description: 'User password',
            },
            role: {
              type: 'string',
              description: 'User role',
              enum: ['ADMIN', 'COMMON']
            },
          },
          required: ['name', 'email', 'password', 'role']
        },
      }
    }
  },
  apis: ['./src/**/*.controller.ts']
})
