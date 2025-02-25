import { Post } from './post.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
    private posts: Post[] = [];
    private currentId = 1;

    async find(): Promise<Post[]> {
        return [...this.posts];
    }

    async findOne(options: { where: { id: number } }): Promise<Post | null> {
        const post = this.posts.find(post => post.id === options.where.id);
        return post || null;
    }

    create(data: Partial<Post>): Post {
        const post: Post = {
            id: this.currentId++,
            title: data.title || '',
            content: data.content || '',
            authorId: data.authorId || 0
        };
        return post;
    }

    async save(post: Post): Promise<Post> {
        this.posts.push(post);
        return post;
    }

    async update(id: number, data: Partial<Post>): Promise<void> {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.posts[index] = {
                ...this.posts[index],
                ...data
            };
        }
    }

    async delete(id: number): Promise<void> {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.posts.splice(index, 1);
        }
    }
}