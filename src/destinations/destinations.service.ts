import { Injectable } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Destination } from './entities/destination.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DestinationsService {
    constructor(
        @InjectRepository(Destination)
        private readonly destinationsRepository: Repository<Destination>
    ) {}

    // 등록
    async create(model: CreateDestinationDto) : Promise<Destination>{
        const destination = this.destinationsRepository.create(model);

        const createdDest = await this.destinationsRepository.save(destination);

        return createdDest;
    }

    // 모든 여행지 목록 조회
    async findAll() : Promise<Destination[]>{
        return this.destinationsRepository.find();
    }

    // 특정 여행지 상세 조회
    async findById(id: number): Promise<Destination | null>{
        return this.destinationsRepository.findOneBy({
            id,
          });
    }

    // 여행지 삭제
    async remove(id: number) : Promise<void>{
        await this.destinationsRepository.delete(id);
    }
}
