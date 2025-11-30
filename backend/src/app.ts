import express, { Express } from 'express';
import cors from 'cors';
import routes from './controllers/routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

// Root level health check for Docker/K8s
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Must be last
app.use(errorHandler);

export default app;

