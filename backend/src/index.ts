import type { Express } from 'express';
import express from 'express';
import router from './routes/index';
import dotenv from 'dotenv';

// Loading environment file
dotenv.config();

// creating app instance
const app: Express = express();
const PORT: number = Number(process.env.PORT) ?? 3000;

// Some middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Using routers
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on PORT: http://localhost:${PORT}`);
});
