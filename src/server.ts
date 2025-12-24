import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'User Wishes Service API' });
});

app.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export { app };
