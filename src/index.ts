import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'User Wishes Service API' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

export { app };
