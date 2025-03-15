import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { BucketList } from './entities/bucket-list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { CreateBucketListDto } from './dto/create-bucket-list.dto';

@Injectable()
export class BucketListsService {
    constructor(
        @InjectRepository(BucketList)
        private readonly bucketListRepository: Repository<BucketList>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async create(userId: string, model: CreateBucketListDto): Promise<BucketList> {
        const user = await this.userRepository.findOne({
            where: { id : userId },
        })

        if (!user){
            throw new UnauthorizedException("없는 유저입니다");
        }

        const existingBucket = await this.bucketListRepository.findOne({
            where: { 
                name: model.name,
                user: {
                    id: userId,
                },
            }
        });

        if (existingBucket) {
            throw new BadRequestException("이미 존재하는 버킷리스트입니다");
        }

        const newBucket = this.bucketListRepository.create({
            ...model,
            user,
        })

        return this.bucketListRepository.save(newBucket);
    }

    async findbyId(userId: string, id: number): Promise<BucketList | null> {
        return this.bucketListRepository.findOne({
            where : {
                id,
                user: {
                    id: userId,
                },
            }
        })
    }

    async findAll(userId: string): Promise<BucketList[]>{
        return this.bucketListRepository.find({
            where : {
                user: {
                    id: userId,
                },
            }
        })
    }

    async remove(userId: string, id: number): Promise<void>{ 
        const bucket = await this.findbyId(userId, id);

        if (!bucket) {
            throw new BadRequestException("찾지 못했습니다");
        }

        // delete로 쓰려면 id만 넣으면 됨
        await this.bucketListRepository.remove(bucket);
    }
}
