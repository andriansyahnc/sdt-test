import express, { Request, Response } from 'express';
import { UserService } from './services/UserService.js';
import { createUserRouter } from './routes/userRoutes.js';
import { birthdayRouter } from './routes/birthdayRoutes.js';

const app = express();
const userService = new UserService();

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'User Wishes Service API' });
});

app.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/birthday', birthdayRouter);
app.use('/users', createUserRouter(userService));

export { app };
