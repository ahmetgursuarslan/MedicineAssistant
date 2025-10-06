import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from '../entities/user';

// Legacy service kept for backward compatibility with old imports.
// Prefer using the new UsersService in src/users/ moving forward.
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOne(userId: string): Promise<User & { companies?: any[] }> {
        const user = await this.userRepository.findOne({ where: { userId }, relations: ['companies'] });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async create(data: Partial<User>): Promise<User> {
        const entity = this.userRepository.create({
            ...data,
            userRegistrationDate: data.userRegistrationDate || new Date(),
            userActive: data.userActive ?? true,
        });
        return this.userRepository.save(entity);
    }

    async update(userId: string, data: Partial<User>): Promise<UpdateResult> {
        // Clean undefined keys to avoid overwriting with null implicitly
        Object.keys(data).forEach((k) => (data as any)[k] === undefined && delete (data as any)[k]);
        return this.userRepository.update({ userId }, data);
    }

    async deleteById(userId: string): Promise<DeleteResult> {
        return this.userRepository.delete({ userId });
    }

    async delete(user: User): Promise<DeleteResult> {
        return this.deleteById(user.userId);
    }
}