import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService.js';
import { CreateUserDto, UserResponseDto } from '../dto/UserDto.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';

export const createUserRouter = (userService: UserService): Router => {
  const router = Router();

  router.post('/', validationMiddleware(CreateUserDto), async (req: Request, res: Response) => {
    try {
      const dto: CreateUserDto = req.body;
      const user = await userService.createUser(dto);
      const response: UserResponseDto = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        dateOfBirth: user.date_of_birth instanceof Date ? user.date_of_birth.toISOString().slice(0, 10) : String(user.date_of_birth),
        location: user.location,
        timezone: user.timezone,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
      res.status(201).json(response);
    } catch (error: unknown) {
      let message: string;
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        message = (error as { message: string }).message;
      } else {
        message = String(error);
      }
      res.status(500).json({ error: 'Failed to create user', message });
    }
  });

  return router;
};
