import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto) : Promise<User> {
        const createdUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(createdUser);
    }

    async findAll() : Promise<User[]> {
        return this.userRepository.find();
    }

    async findbyId(id: string): Promise<User | null> {
        return this.userRepository.findOne({where: {id}});
    }

    async findbyUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({where: {username}});
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>{
        await this.userRepository.update(id, updateUserDto);
        return this.findbyId(id);
    }
    
    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
