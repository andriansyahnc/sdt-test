import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto, UserResponseDto } from '../dto/UserDto';
import { validationMiddleware } from '../middlewares/validationMiddleware';

export const createUserRouter = (userService: UserService): Router => {
  const router = Router();


  router.post('/', validationMiddleware(CreateUserDto), async (req: Request, res: Response) => {
    try {
      const dto: CreateUserDto = req.body;
      const user = await userService.createUser(dto);
      const response: UserResponseDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        location: user.location,
        timezone: user.timezone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  return router;
};
