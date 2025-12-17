import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Jesus',
    description: 'Your first name',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Christ',
    description: 'Your last name',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  lastName?: string;
}
