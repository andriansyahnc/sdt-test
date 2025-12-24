import { IsString, IsNotEmpty, MinLength, MaxLength, IsDateString } from 'class-validator';
import { IsValidTimezone } from '../validators/TimezoneValidator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  location!: string;

  @IsString()
  @IsNotEmpty()
  @IsValidTimezone()
  timezone!: string;
}

export interface UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  location: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}
