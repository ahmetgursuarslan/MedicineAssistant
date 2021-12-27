import { Controller, Get } from '@nestjs/common';
import { User } from 'entities/user';
import { UserService } from 'providers/user.service';

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService){
    }
    
    @Get()
    findOne(userId: string): Promise<User>{
        return this.userService.findOne(userId);
    }
    
    
}