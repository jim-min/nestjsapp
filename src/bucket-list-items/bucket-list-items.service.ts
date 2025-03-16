import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BucketList } from 'src/bucket-lists/entities/bucket-list.entity';
import { Repository } from 'typeorm';
import { BucketListItem } from './entities/bucket-list-item.entity';
import { User } from 'src/users/users.entity';
import { BucketListsService } from 'src/bucket-lists/bucket-lists.service';
import { CreateBucketListDto } from 'src/bucket-lists/dto/create-bucket-list.dto';
import { CreateBucketListItemDto } from './dto/create-bucket-list-item.dto';
import { Destination } from 'src/destinations/entities/destination.entity';
import { UpdateBucketListItemDto } from './dto/update-bucket-list-item.dto';

@Injectable()
export class BucketListItemsService {
    constructor(
        @InjectRepository(BucketList)
        private readonly bucketListsRepository: Repository<BucketList>,
        @InjectRepository(BucketListItem)
        private readonly bucketListsItemsRepository: Repository<BucketListItem>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Destination)
        private readonly destinationsRepository: Repository<Destination>,
        private readonly bucketListsService: BucketListsService
    ){}

    async create(userId: string, bucketListId: number, model: CreateBucketListItemDto)
    {
        const user = await this.userRepository.findOne({
            where: { id : userId },
        })

        if (!user){
            throw new UnauthorizedException("없는 유저입니다");
        }

        const bucketList = await this.bucketListsService.findbyId(userId, bucketListId);

        if (!bucketList) {
            throw new BadRequestException('버킷리스트를 찾지 못했습니다');
        }

        const destination = await this.destinationsRepository.findOne({
            where: { id: model.destinationId },
          });
      
          if (!destination) {
            throw new BadRequestException('여행지를 찾지 못했습니다.');
          }
          
        const newBucketItem = this.bucketListsItemsRepository.create({
            ...model,
            bucketList,
            destination
        });

        await this.bucketListsItemsRepository.save(newBucketItem);

        return {...newBucketItem, bucketList: undefined};
    }

    async findAll(userId: string, bucketListId: number): Promise<BucketListItem[]>{
        return this.bucketListsItemsRepository.find({
            where: {
                bucketList: { 
                    id: bucketListId, 
                    user: {
                        id: userId,
                    },
                },
            },
            relations: ['destination']
        });
    }

    async update(userId: string, bucketListId: number, bucketListItemId: number, model: UpdateBucketListItemDto) {
        const bucketListItem = await this.bucketListsItemsRepository.findOne({
            where : {
                id: bucketListItemId,
                bucketList: {
                    id: bucketListId,
                    user: { id: userId },
                }
            }
        });

        if (!bucketListItem) {
             throw new BadRequestException('버킷리스트 아이템을 찾지 못했습니다');
        }

        bucketListItem.achieved = model.achieved;

        await this.bucketListsItemsRepository.save(bucketListItem);

        return {...bucketListItem, bucketList: undefined};
    }

    async remove(
        userId: string,
        bucketListId: number,
        bucketListItemId: number,
    ): Promise<void> {
        const bucketListItem = await this.bucketListsItemsRepository.findOne({
            where : {
                id: bucketListItemId,
                bucketList: {
                    id: bucketListId,
                    user: { id: userId },
                }
            }
        });

        if (!bucketListItem) {
             throw new BadRequestException('버킷리스트 아이템을 찾지 못했습니다');
        }

        await this.bucketListsItemsRepository.remove(bucketListItem);
    }
}
