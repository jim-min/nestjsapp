import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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
        return this.destinationsService.findById(id);
    }

    // remove 서비스
    @Delete('/:id')
    async remove(@Param('id', ParseIntPipe) id: number){
        return this.destinationsService.remove(id);
    }
}
