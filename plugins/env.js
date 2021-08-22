'use strict'

const fp = require('fastify-plugin')
const env = require('fastify-env')

module.exports = fp(
  async (fastify, _) => {
    fastify.register(env, {
      confKey: 'config',
      dotenv: true,
      schema: {
        type: 'object',
        required: [
          'POSTGRES_HOST',
          'POSTGRES_PORT',
          'POSTGRES_USERNAME',
          'POSTGRES_PASSWORD',
          'POSTGRES_DATABASE',
        ],
        properties: {
          POSTGRES_HOST: {
            type: 'string',
            default: 'localhost',
          },
          POSTGRES_PORT: {
            type: 'number',
            default: 5432,
          },
          POSTGRES_USERNAME: {
            type: 'string',
            default: 'postgres',
          },
          POSTGRES_PASSWORD: {
            type: 'string',
            default: 'password',
          },
          POSTGRES_DATABASE: {
            type: 'string',
            default: 'test',
          },
        },
      },
    })
  },
  { fastify: '3.x', name: 'plugin-env' }
)
