import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'dtos/user.dto';
import { User } from 'entities/user';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService{

    constructor(@InjectRepository(User)
    private readonly userRepository: Repository<User>,) {}

    async findOne(userId: string): Promise<UserDto>{
        let userDto : UserDto = new UserDto();
        let user = await this.userRepository.findOne({userId: userId });
        userDto.user = user;
        userDto.companies = user.companies;  
       return  userDto;
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