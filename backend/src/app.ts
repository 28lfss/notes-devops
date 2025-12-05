import express, { Express } from 'express';
import cors from 'cors';
import routes from './controllers/routes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Get API prefix from environment variable, default to '/api'
const API_PREFIX = process.env.API_PREFIX || '/api';
// Normalize prefix: ensure it starts with '/' and doesn't end with '/'
const normalizedPrefix = API_PREFIX.startsWith('/') 
  ? API_PREFIX.replace(/\/$/, '') 
  : `/${API_PREFIX.replace(/\/$/, '')}`;

app.use(normalizedPrefix, routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export default app;

