import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiPropertyOptional({ example: 'Jesus' })
  @Expose()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Christ' })
  @Expose()
  lastName?: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt?: Date;

  @ApiProperty({ example: 3 })
  @Expose()
  roleId: number;
}
