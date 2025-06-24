import { Hono } from 'hono';
import dataRoutes from './data';

const app = new Hono();

app.route('/data', dataRoutes);

export default app;