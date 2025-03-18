import { Controller, Get, Post, Body, Param, Delete, Patch, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSchema, type UserDTO } from '@repo/types';
import { Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/validate/validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }



  @Post()
  @UsePipes(new ZodValidationPipe(UserSchema))
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
