import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/user.controller';
import { User } from '../entities/user';
import { UserService } from '../providers/user.service';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [UserService],
    controllers:[UserController]
})
export class UserModule {

}