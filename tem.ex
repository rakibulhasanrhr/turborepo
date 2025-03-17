import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO, UpdatedUserDTO } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUser: UserDTO) {
    const userCreateInput: Prisma.UserCreateInput = {
      ...createUser,
      allowedModules: Array.isArray(createUser.allowedModules) ? createUser.allowedModules : []

    }
    return this.usersService.create(userCreateInput);
  }


  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('name') name?: string, @Query('status') status?: "ACTIVE" | "INACTIVE", @Query("from") from?: string, @Query("to") to?: string, @Query("sortBy") sortBy?: string, @Query("order") order?: string) {
    return this.usersService.findAll(page, limit, name, status, from, to, sortBy, order);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedUser: UpdatedUserDTO) {
    const userUpdateInput: Prisma.UserUpdateInput = {
      ...updatedUser,
      allowedModules: Array.isArray(updatedUser.allowedModules) ? updatedUser.allowedModules : undefined
    };
    return this.usersService.update(id, userUpdateInput);
  }

  @Delete()
  removeMany(@Body("ids") ids: string[]) {
    return this.usersService.removeMany(ids)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
