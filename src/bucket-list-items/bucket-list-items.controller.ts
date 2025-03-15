import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BucketListItemsService } from './bucket-list-items.service';
import { AccessTokenGuard } from 'src/common/guard/access-token.guard';
import { CreateBucketListItemDto } from './dto/create-bucket-list-item.dto';
import { UpdateBucketListItemDto } from './dto/update-bucket-list-item.dto';

@Controller('bucket-list-items')
export class BucketListItemsController {
    constructor(
        private readonly bucketListItemsService: BucketListItemsService,
    ){}

    @Post('/:bucketListId/items')
    @UseGuards(AccessTokenGuard)
    async createBucketListItem(
        @Param('bucketListId', ParseIntPipe) bucketListId: number,
        @Body() body: CreateBucketListItemDto,
        @Req() req: any
    ){
        const userId = req.user['id'];
        return this.bucketListItemsService.create(userId, bucketListId, body);
    }

    @Get('/:bucketListId/items')
    @UseGuards(AccessTokenGuard)
    async findAllBucketListItems(
        @Req() req: any,
        @Param('bucketListId', ParseIntPipe) bucketListId: number,
    ) {
        const userId = req.user['id'];
        return this.bucketListItemsService.findAll(userId, bucketListId);
    }

    @Patch('/:bucketListId/items/:itemId')
    @UseGuards(AccessTokenGuard)
    async updateBucketListItem(
        @Req() req: any,
        @Param('bucketListId', ParseIntPipe) bucketListId: number,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Body() body: UpdateBucketListItemDto
    ) {
        const userId = req.user['id'];
        return this.bucketListItemsService.update(userId, bucketListId, itemId, body);
    }

    @Delete('/:bucketListId/items/:itemId')
    @UseGuards(AccessTokenGuard)
    async deleteBucketListItem(
        @Req() req: any,
        @Param('bucketListId', ParseIntPipe) bucketListId: number,
        @Param('itemId', ParseIntPipe) itemId: number,
    ) {
        const userId = req.user['id'];
        return this.bucketListItemsService.remove(userId, bucketListId, itemId);
    }
}
