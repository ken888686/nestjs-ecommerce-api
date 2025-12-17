import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'User found', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.user({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new UserResponseDto(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiOkResponse({ description: 'List of users', type: [UserResponseDto] })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async getUsers(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<UserResponseDto[]> {
    const users = await this.userService.users({
      skip: skip !== undefined ? +skip : undefined,
      take: take !== undefined ? +take : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => new UserResponseDto(user));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiOkResponse({ description: 'User updated', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userService.user({ id });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const user = await this.userService.updateUser({
      where: { id },
      data: updateData,
    });

    return new UserResponseDto(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const existingUser = await this.userService.user({ id });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userService.deleteUser({ id });
  }
}
