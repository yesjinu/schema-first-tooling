import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Post,
  PostsConnection,
  PostsIdPatchRequest,
  PostsPostRequest,
} from 'generated';
import { Observable, of } from 'rxjs';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    { id: 1, title: 'First Post', body: 'This is the first post.' },
    { id: 2, title: 'Second Post', body: 'This is the second post.' },
    { id: 3, title: 'Third Post', body: 'This is the third post.' },
    { id: 4, title: 'Fourth Post', body: 'This is the fourth post.' },
    { id: 5, title: 'Fifth Post', body: 'This is the fifth post.' },
    { id: 6, title: 'Sixth Post', body: 'This is the sixth post.' },
    { id: 7, title: 'Seventh Post', body: 'This is the seventh post.' },
    { id: 8, title: 'Eighth Post', body: 'This is the eighth post.' },
    { id: 9, title: 'Ninth Post', body: 'This is the ninth post.' },
    { id: 10, title: 'Tenth Post', body: 'This is the tenth post.' },
  ];
  private nextId = 10;

  getManyPaginated(first?: number, after?: string): PostsConnection {
    const afterId = after ? parseInt(after, 10) : 0;
    const limit = first ?? this.posts.length;

    const filteredPosts = this.posts.filter((p) => p.id > afterId);
    const edges = filteredPosts.slice(0, limit).map((post) => ({
      cursor: post.id.toString(),
      node: post,
    }));

    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
    const hasNextPage =
      filteredPosts.length > limit &&
      this.posts.some((p) => p.id > parseInt(endCursor ?? '0', 10));

    const connection: PostsConnection = {
      edges: edges,
      pageInfo: {
        hasNextPage: hasNextPage,
        endCursor: endCursor,
      },
    };
    return connection;
  }

  getWithId(id: number): Post {
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  updateWithId(id: number, postsIdPatchRequest?: PostsIdPatchRequest): Post {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    const updatedPost = { ...this.posts[postIndex], ...postsIdPatchRequest };
    this.posts[postIndex] = updatedPost;

    return updatedPost;
  }

  create(postsPostRequest?: PostsPostRequest): Post {
    if (!postsPostRequest || !postsPostRequest.title) {
      throw new BadRequestException('Title is required');
    }

    const newPost: Post = {
      id: this.nextId++,
      title: postsPostRequest.title,
      body: postsPostRequest.body,
    };

    this.posts.push(newPost);
    return newPost;
  }
}
