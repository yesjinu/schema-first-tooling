import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './models/post.model';
import { ObjectType, Field } from '@nestjs/graphql';

// Define Relay types needed by the schema directly here for now
// Ideally, these would come from generated types or a shared models file

@ObjectType()
class PostEdge {
  @Field(() => Post)
  node: Post;

  @Field()
  cursor: string;
}

@ObjectType()
class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true }) // Cursor can be null if no results
  endCursor?: string;
}

@ObjectType()
class PostsConnection {
  @Field(() => [PostEdge])
  edges: PostEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

@Resolver(() => Post) // Resolves fields for the Post type
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post, { description: 'Create a new post' })
  createPost(@Args('input') createPostInput: any): Post {
    // Note: In a real app, you might need to adjust the return type
    // if the service method doesn't return the exact GQL type.
    return this.postsService.create(createPostInput);
  }

  @Query(() => PostsConnection, {
    name: 'posts',
    description: 'Get a list of posts with optional pagination',
  })
  findAll(
    @Args('first', { type: () => Int, defaultValue: 10, nullable: true })
    first: number,
    @Args('after', { type: () => String, nullable: true }) after?: string,
  ) {
    // The service method is already structured to return the connection shape
    return this.postsService.findAll(first, after);
  }

  @Query(() => Post, {
    name: 'post',
    nullable: true,
    description: 'Get a single post by its ID',
  })
  findOne(@Args('id', { type: () => ID }) id: string): Post | undefined {
    return this.postsService.findOne(id);
    // Consider throwing GraphQLNotFoundError if not found, depending on requirements
  }

  @Mutation(() => Post, {
    nullable: true,
    description: 'Update an existing post',
  })
  updatePost(@Args('input') updatePostInput: any): Post | undefined {
    return this.postsService.update(updatePostInput);
    // Consider handling the case where the post to update isn't found
  }

  // Optional: Add a remove mutation later if needed
  // @Mutation(() => Boolean)
  // removePost(@Args('id', { type: () => ID }) id: string) {
  //   return this.postsService.remove(id);
  // }
}
