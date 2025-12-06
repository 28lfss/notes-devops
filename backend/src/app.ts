import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './controllers/routes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { swaggerSpec } from './config/swagger';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

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

// Get API prefix from environment variable, default to '/api'
const API_PREFIX = process.env.API_PREFIX || '/api';
const normalizedPrefix = normalizeApiPrefix(API_PREFIX);

// Swagger UI setup
app.use(`${normalizedPrefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Notes API Documentation',
}));

app.use(normalizedPrefix, routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export default app;
