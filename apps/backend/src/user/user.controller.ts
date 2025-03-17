import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import type { UserDTO } from '@repo/types';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: UserDTO) {

    const userCreateInput: Prisma.DashboardCreateInput = {
      ...createUserDto,
    }

    return this.userService.create(userCreateInput);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UserDTO) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete()
  removeMany(@Body("ids") ids: string[]) {
    return this.userService.removeMany(ids)
  }

  @Delete('')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
