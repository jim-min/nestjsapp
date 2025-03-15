import { Module } from '@nestjs/common';
import { BucketListItemsController } from './bucket-list-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { BucketList } from 'src/bucket-lists/entities/bucket-list.entity';
import { BucketListItem } from './entities/bucket-list-item.entity';
import { BucketListItemsService } from './bucket-list-items.service';
import { Destination } from 'src/destinations/entities/destination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BucketList, BucketListItem, Destination])
  ],
  providers: [BucketListItemsService],
  controllers: [BucketListItemsController]
})
export class BucketListItemsModule {}
