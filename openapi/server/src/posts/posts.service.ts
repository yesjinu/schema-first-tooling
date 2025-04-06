import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePostDto,
  UpdatePostDto,
  PostDto,
  PostsConnectionDto,
} from './post.dto';

@Injectable()
export class PostsService {
  private posts: PostDto[] = [];
  private idCounter = 1;

  create(createPostDto: CreatePostDto): PostDto {
    const post: PostDto = {
      id: this.idCounter++,
      ...createPostDto,
    };
    this.posts.push(post);
    return post;
  }

  findAll(first = 10, after?: string): PostsConnectionDto {
    let startIndex = 0;
    if (after) {
      const decodedCursor = parseInt(Buffer.from(after, 'base64').toString());
      startIndex =
        this.posts.findIndex((post) => post.id === decodedCursor) + 1;
    }

    const slicedPosts = this.posts.slice(startIndex, startIndex + first);

    const edges = slicedPosts.map((post) => ({
      node: post,
      cursor: Buffer.from(String(post.id)).toString('base64'),
    }));

    const hasNextPage = startIndex + first < this.posts.length;
    const endCursor = edges.length ? edges[edges.length - 1].cursor : '';

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor,
      },
    };
  }

  findOne(id: number): PostDto {
    const post = this.posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto): PostDto {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updatePostDto,
    };

    return this.posts[postIndex];
  }
}
