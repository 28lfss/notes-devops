import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

/**
 * Normalizes API prefix to ensure it starts with '/' and doesn't end with '/'
 * @param prefix - The API prefix from environment variable
 * @returns Normalized prefix
 */
const normalizeApiPrefix = (prefix: string): string => {
  return prefix.startsWith('/') 
    ? prefix.replace(/\/$/, '') 
    : `/${prefix.replace(/\/$/, '')}`;
};

const API_PREFIX = process.env.API_PREFIX || '/api';
const normalizedPrefix = normalizeApiPrefix(API_PREFIX);

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'RESTful API for managing notes with authentication',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `${normalizedPrefix}`,
        description: 'API server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login/register endpoints',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the user',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
          required: ['id', 'email', 'createdAt', 'updatedAt'],
        },
        Note: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the note',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            title: {
              type: 'string',
              description: 'Note title',
              example: 'My First Note',
            },
            content: {
              type: 'string',
              description: 'Note content',
              example: 'This is the content of my note.',
            },
            userId: {
              type: 'string',
              description: 'ID of the user who owns the note',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Note creation timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Note last update timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
          required: ['id', 'title', 'content', 'userId', 'createdAt', 'updatedAt'],
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              description: 'User password (minimum 6 characters)',
              example: 'password123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'password123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
          required: ['user', 'token'],
        },
        CreateNoteRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              description: 'Note title',
              example: 'My First Note',
            },
            content: {
              type: 'string',
              minLength: 1,
              description: 'Note content',
              example: 'This is the content of my note.',
            },
          },
        },
        UpdateNoteRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              description: 'Note title',
              example: 'Updated Note Title',
            },
            content: {
              type: 'string',
              minLength: 1,
              description: 'Note content',
              example: 'Updated note content.',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Validation failed',
            },
            stack: {
              type: 'string',
              description: 'Error stack trace (only in development mode)',
              example: 'Error: Validation failed\n    at ...',
            },
            message: {
              type: 'string',
              description: 'Original error message (for unexpected errors)',
              example: 'Original error message',
            },
          },
          required: ['error'],
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
          },
          required: ['status'],
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Notes',
        description: 'Note management endpoints (requires authentication)',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  // Path to controller files with Swagger annotations
  // Works in both dev (tsx) and production (compiled) since we copy src to production image
  apis: [path.join(process.cwd(), 'src/controllers/*.ts')],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

