import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { UpdateUserDto } from './dto/update-user.dto';
import { toUserResponse } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findMe(id: string) {
    const user = await this.repo.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException();
    return toUserResponse(user);
  }

  async updateUser(requester: any, id: string, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException();
    const isSelf = requester.userId === id;
    const isAdmin = requester.userRole === 'admin';
    if (!isSelf && !isAdmin) throw new ForbiddenException();
    if (dto.role && !isAdmin) delete dto.role;
    if (dto.email) user.userEmail = dto.email;
    if (dto.active !== undefined && isAdmin) user.userActive = dto.active;
    if (dto.role && isAdmin) user.userRole = dto.role;
    user.userUpdateDate = new Date();
    const saved = await this.repo.save(user);
    return toUserResponse(saved);
  }

  async findAllUsers() {
    const users = await this.repo.find({
      select: ['userId', 'userEmail', 'userRegistrationDate', 'userUpdateDate', 'userActive', 'userRole'],
    });
    return users.map(user => toUserResponse(user));
  }

  async countUsers(): Promise<number> {
    return await this.repo.count();
  }
}
