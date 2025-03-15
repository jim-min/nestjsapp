import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { BucketListsService } from './bucket-lists.service';
import { CreateBucketListDto } from './dto/create-bucket-list.dto';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { Request } from 'express';

@Controller('bucket-lists')
export class BucketListsController {
    constructor(
        private readonly bucketListService: BucketListsService,
    ) {}

    @Post('')
    @UseGuards(AccessTokenGuard)
    async createBucketList(model: CreateBucketListDto, @Req() req: any){
        const userId = req.user['id'];

        return this.bucketListService.create(userId, model);
    }

    @Get('')
    @UseGuards(AccessTokenGuard)
    async getBucketLists(@Req() req: any) {
        const userId = req.user['id'];
       
        return this.bucketListService.findAll(userId);
    }

    @Get('')
    @UseGuards(AccessTokenGuard)
    async getBucketListbyId(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['id'];
       
        return this.bucketListService.findbyId(userId, id);
    }

    @Delete('')
    @UseGuards(AccessTokenGuard)
    async deleteBucketList(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['id'];
       
        return this.bucketListService.remove(userId, id);
    }
}
