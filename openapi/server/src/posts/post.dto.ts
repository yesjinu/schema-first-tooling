import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'The body of the post',
    type: String,
    required: true,
  })
  body: string;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    type: String,
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'The body of the post',
    type: String,
    required: false,
  })
  body?: string;
}

export class PostDto {
  @ApiProperty({
    description: 'The unique identifier for the post',
    type: Number,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the post',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'The body of the post',
    type: String,
    required: true,
  })
  body: string;
}

export class PostEdgeDto {
  @ApiProperty({
    description: 'The post node',
    type: PostDto,
    required: true,
  })
  node: PostDto;

  @ApiProperty({
    description: 'The cursor for pagination',
    type: String,
    required: true,
  })
  cursor: string;
}

export class PageInfoDto {
  @ApiProperty({
    description: 'Whether there are more pages available',
    type: Boolean,
    required: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'The cursor of the last item in the current page',
    type: String,
    required: true,
  })
  endCursor: string;
}

export class PostsConnectionDto {
  @ApiProperty({
    description: 'Array of post edges',
    type: [PostEdgeDto],
    required: true,
  })
  edges: PostEdgeDto[];

  @ApiProperty({
    description: 'Information about pagination',
    type: PageInfoDto,
    required: true,
  })
  pageInfo: PageInfoDto;
}
