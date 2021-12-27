import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class UserService{

    constructor(@InjectRepository(User)
    private readonly userRepository: Repository<User>,) {}

    async findOne(userId: string): Promise<User>{
       return this.userRepository.findOne({userId: userId});
    }
}