import { Hono } from 'hono';
import regionRoutes from './routes/region';
import dataRoutes from './routes/data';

const app = new Hono();

app.route('/api/region', regionRoutes);
app.route('/api/data', dataRoutes);

export default app;