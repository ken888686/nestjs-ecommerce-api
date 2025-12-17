import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiPropertyOptional({ example: 'Jesus' })
  @Expose()
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Christ' })
  @Expose()
  lastName?: string | null;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt?: Date | null;

  @ApiProperty({ example: 3 })
  @Expose()
  roleId: number;
}
