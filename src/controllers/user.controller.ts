import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { User } from '../entities/user';
import { UserService } from '../providers/user.service';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService){
    }
    
    @Get()
    findOne(userId: string): Promise<User & { companies?: any[] }>{
        return this.userService.findOne(userId);
    }
    @Post()
    create(user: User): Promise<User>{
        return this.userService.create(user);
    }

    @Put()
    update(userId: string, user: User):Promise<UpdateResult>{
        return this.userService.update(userId,user);
    }
    
    @Delete()
    deleteById(userId: string):Promise<DeleteResult>{
        return this.userService.deleteById(userId);
    }
    @Delete()
    delete(user: User):Promise<DeleteResult>{
        return this.userService.delete(user);
    }
}