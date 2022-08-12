import {
  Controller,
  Body,
  Patch,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import type { ReturnUserDto } from '../dtos';
import { UpdateUserDto } from '../dtos';
import { ApiOkResponse } from '@nestjs/swagger';
import { User } from '../entities';
import { JwtGuard } from 'src/@framework/guards';
import { UserDecorator } from 'src/@framework/decorators';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @ApiOkResponse({
    description: 'The user was found successfully',
    type: User,
  })
  @UseGuards(JwtGuard)
  @Get('profile')
  public async findOne(@UserDecorator() user: User): Promise<ReturnUserDto> {
    return await this.userService.findOne(user);
  }

  // FOR ADMIN
  @ApiOkResponse({
    description: 'All users were found successfully',
  })
  @Get('profiles')
  public async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @ApiOkResponse({
    description: 'The user was updated successfully',
    type: User,
  })
  @UseGuards(JwtGuard)
  @Patch('profile')
  public async update(@UserDecorator() user: User, @Body() updateUserDto: UpdateUserDto): Promise<ReturnUserDto> {
    return this.userService.update(user, updateUserDto);
  }

  @ApiOkResponse({
    description: 'The user was deleted successfully',
    type: User,
  })
  @UseGuards(JwtGuard)
  @Delete('profile')
  public async remove(@UserDecorator() user: User): Promise<{ message: string }> {
    return this.userService.remove(user);
  }

}