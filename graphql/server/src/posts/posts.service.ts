import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './models/post.model'; // Define this model if it doesn't exist

// Helper function for Base64 encoding/decoding (simplified for cursor)
const encodeCursor = (id: string): string => Buffer.from(id).toString('base64');
const decodeCursor = (cursor: string): string =>
  Buffer.from(cursor, 'base64').toString('ascii');

@Injectable()
export class PostsService {
  private posts: Post[] = [
    // Sample data
    { id: '1', title: 'First Post', body: 'This is the first post.' },
    { id: '2', title: 'Second Post', body: 'This is the second post.' },
    { id: '3', title: 'Third Post', body: 'This is the third post.' },
  ];
  private nextId = 4;

  create(createPostInput: any): Post {
    const newPost: Post = {
      id: String(this.nextId++),
      ...createPostInput,
    };
    this.posts.push(newPost);
    return newPost;
  }

  findAll(first: number, after?: string) {
    let startIndex = 0;
    if (after) {
      const decodedCursor = decodeCursor(after);
      const index = this.posts.findIndex((post) => post.id === decodedCursor);
      if (index !== -1) {
        startIndex = index + 1;
      }
    }

    const slicedPosts = this.posts.slice(startIndex, startIndex + first);
    const edges = slicedPosts.map((post) => ({
      node: post,
      cursor: encodeCursor(post.id),
    }));

    const hasNextPage = startIndex + first < this.posts.length;
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      edges,
      pageInfo: {
        hasNextPage,
        endCursor,
      },
    };
  }

  findOne(id: string): Post | undefined {
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      // Optional: Throw an exception if not found, depending on schema nullability
      // throw new NotFoundException(`Post with ID "${id}" not found`);
      return undefined;
    }
    return post;
  }

  update(updatePostInput: any): Post | undefined {
    const postIndex = this.posts.findIndex((p) => p.id === updatePostInput.id);
    if (postIndex === -1) {
      // Optional: Throw an exception or handle as per your logic
      // throw new NotFoundException(`Post with ID "${updatePostInput.id}" not found`);
      return undefined; // Or throw NotFoundException
    }
    const updatedPost = {
      ...this.posts[postIndex],
      ...updatePostInput, // Apply partial updates
    };
    this.posts[postIndex] = updatedPost;
    return updatedPost;
  }

  // Optional: Add a remove method if needed later
  // remove(id: string): boolean {
  //   const initialLength = this.posts.length;
  //   this.posts = this.posts.filter(p => p.id !== id);
  //   return this.posts.length < initialLength;
  // }
}
