import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint({ async: false })
export class IsValidTimezoneConstraint implements ValidatorConstraintInterface {
  validate(timezone: string) {
    try {
      const dt = DateTime.now().setZone(timezone);
      return dt.isValid;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'Invalid timezone. Must be a valid IANA timezone (e.g., America/New_York, Europe/London)';
  }
}

export function IsValidTimezone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTimezoneConstraint,
    });
  };
}
