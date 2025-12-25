import { IsString, IsNotEmpty, MinLength, MaxLength, IsDateString, IsEmail } from 'class-validator';
import { IsValidTimezone } from '../validators/TimezoneValidator.js';

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

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

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
  email: string;
  dateOfBirth: string;
  location: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}
