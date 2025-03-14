import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Controller('destinations')
export class DestinationsController {
    constructor(
        private readonly destinationsService: DestinationsService
    ) {}

    // create 서비스
    @Post('')
    async createDestination(@Body() body: CreateDestinationDto){
        return this.destinationsService.create(body);
    };

    // findAll 서비스
    @Get('')
    async findAllDestinations(){
        return this.destinationsService.findAll();
    }

    // findById 서비스
    @Get('/:id')
    async findById(@Param('id', ParseIntPipe) id: number){
        const findDest = await this.destinationsService.findById(id);

        if (!findDest) {
            throw new NotFoundException("여행지를 찾을 수 없습니다");
        }

        return findDest;
    }

    // remove 서비스
    @Delete('/:id')
    async remove(@Param('id', ParseIntPipe) id: number){
        // TODO : 404 Error 처리
        return this.destinationsService.remove(id);
    }
}
