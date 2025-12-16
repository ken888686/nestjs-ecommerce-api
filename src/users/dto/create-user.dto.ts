import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Your email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Your password',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiPropertyOptional({
    example: 'Jesus',
    description: 'Your first name',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Christ',
    description: 'Your last name',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    type: 'number',
    default: 3,
  })
  @IsOptional()
  @IsNumber()
  roleId?: number;
}
