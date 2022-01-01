import { Company } from 'entities/company';
import { User } from '../entities/user';
export class UserDto{
    public user :User;
    public companies: Company[];
}