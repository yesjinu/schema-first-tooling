import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreatePostDto,
  UpdatePostDto,
  PostDto,
  PostsConnectionDto,
} from './post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostDto,
  })
  create(@Body() createPostDto: CreatePostDto): PostDto {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({
    name: 'first',
    required: false,
    type: Number,
    description: 'Number of posts to return',
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'after',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of posts',
    type: PostsConnectionDto,
  })
  findAll(
    @Query('first') first?: number,
    @Query('after') after?: string,
  ): PostsConnectionDto {
    return this.postsService.findAll(first, after);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The post ID',
  })
  @ApiResponse({
    status: 200,
    description: 'A post',
    type: PostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findOne(@Param('id') id: string): PostDto {
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      throw new BadRequestException('Invalid post ID');
    }
    return this.postsService.findOne(postId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The post ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'A post',
    type: PostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
  })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): PostDto {
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      throw new BadRequestException('Invalid post ID');
    }
    return this.postsService.update(postId, updatePostDto);
  }
}
