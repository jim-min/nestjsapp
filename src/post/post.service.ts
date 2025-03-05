import { Post } from "./post.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) {}

    async findAll(): Promise<Post[]> {
        return this.postRepository.find();
    }

    async findOne(id: number): Promise<Post | null> {
        return this.postRepository.findOne({where: {id}});
    }

    async create(createPostDto: CreatePostDto): Promise<Post> {
        try {
            const post = this.postRepository.create(createPostDto);
            return await this.postRepository.save(post);
        } catch (error) {
            if (error.code === 23505) {
                throw new ConflictException('Post already exists');
            }
            throw error;
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<Post | null> {
        try {
            const result = await this.postRepository.update(id, updatePostDto);
            if (result.affected === 0) {
                throw new NotFoundException(`Post with ${id} not found`);
            }
            return this.postRepository.findOne({where: {id}});
        } catch(error) {
            throw error;
        }
        
    }

    async remove(id: number): Promise<void> {
        try {
            const result = await this.postRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Post with ${id} not found`);
            }
        } catch(error) {
            throw error;
        }
    }
    
}