import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ballast Lane Backend Challenge',
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
        DupixentMapping: {
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
      }
    }
  },
  apis: ['./src/controllers/*.ts']
})
