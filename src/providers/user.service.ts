import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService{

    constructor(@InjectRepository(User)
    private readonly userRepository: Repository<User>,) {}

    async findOne(userId: string): Promise<User>{
       return this.userRepository.findOne({userId: userId});
    }

    async create(user: User): Promise<User>{
        return this.userRepository.create(user);
    }

    async update(userId: string , user: User): Promise<UpdateResult>{
        return this.userRepository.update({userId: userId},user);
    }

    async deleteById(userId: string ): Promise<DeleteResult>{
        return this.userRepository.delete({userId: userId});
    }

    async delete(user: User): Promise<DeleteResult>{
        return this.userRepository.delete(user);
    }



}