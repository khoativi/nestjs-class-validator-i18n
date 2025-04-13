import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  private users: CreateUserDto[] = [];

  @Post()
  create(@Body() createUserDto: CreateUserDto): CreateUserDto {
    this.users.push(createUserDto);
    return createUserDto;
  }

  @Get(':id')
  findOne(@Param() params: FindUserDto): CreateUserDto | undefined {
    const { id } = params;
    return this.users.find((user) => user.id === id);
  }

  @Put(':id')
  update(
    @Param() params: FindUserDto,
    @Body() updateUserDto: UpdateUserDto
  ): CreateUserDto | null {
    const { id } = params;
    const index = this.users.findIndex((user) => user.id === id);
    if (index > -1) {
      this.users[index] = { ...this.users[index], ...updateUserDto };
      return this.users[index];
    }
    return null;
  }

  @Delete(':id')
  remove(@Param() params: FindUserDto): CreateUserDto[] | null {
    const { id } = params;
    const index = this.users.findIndex((user) => user.id === id);
    if (index > -1) {
      const deletedUser = this.users.splice(index, 1);
      return deletedUser;
    }
    return null;
  }
}
