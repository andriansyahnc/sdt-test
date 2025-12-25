import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const validationMiddleware = <T extends object>(dtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToClass(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const validationErrors = errors.map((error) => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
      }));

      res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
      return;
    }

    req.body = dtoInstance;
    next();
  };
};
