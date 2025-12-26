import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService.js';
import { CreateUserDto, UserResponseDto } from '../dto/UserDto.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';
import { extractErrorMessage } from '../utils/errorUtils.js';

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
        dateOfBirth:
          user.date_of_birth instanceof Date
            ? user.date_of_birth.toISOString().slice(0, 10)
            : String(user.date_of_birth),
        location: user.location,
        timezone: user.timezone,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
      return res.status(201).json(response);
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      return res.status(500).json({ error: 'Failed to create user', message });
    }
  });

  router.put('/:id', async (req: Request, res: Response) => {
    if (req.params.id === '0') {
      return res.status(400).json({ error: 'Cannot update user with id 0' });
    }
    try {
    const dto: CreateUserDto = req.body;
    const user = await userService.updateUser(Number(req.params.id), dto);
      const response: UserResponseDto = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        dateOfBirth:
          user.date_of_birth instanceof Date
            ? user.date_of_birth.toISOString().slice(0, 10)
            : String(user.date_of_birth),
        location: user.location,
        timezone: user.timezone,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
      return res.status(200).json(response);
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      return res.status(500).json({ error: 'Failed to update user', message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    if (req.params.id === '0') {
      return res.status(400).json({ error: 'Cannot delete user with id 0' });
    }
    try {
      const user = await userService.deleteUser(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ error: `User with id ${req.params.id} not found` });
      }
      return res
        .status(200)
        .json({ message: `User with id ${req.params.id} deleted successfully` });
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      return res.status(500).json({ error: 'Failed to delete user', message });
    }
  });

  return router;
};
