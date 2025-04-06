import {
  Controller,
  Get,
  Post as HttpPost,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Observable } from 'rxjs';
import {
  PostsConnection,
  PostsPostRequest,
  Post,
  PostsIdPatchRequest,
} from 'generated';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  postsGet(
    @Query('first') first?: string,
    @Query('after') after?: string,
  ): PostsConnection {
    const firstNum = first ? parseInt(first, 10) : undefined;
    return this.postsService.getManyPaginated(firstNum, after);
  }

  @HttpPost()
  postsPost(@Body() postsPostRequest: PostsPostRequest): Post {
    return this.postsService.create(postsPostRequest);
  }

  @Get(':id')
  postsIdGet(@Param('id', ParseIntPipe) id: number): Post {
    return this.postsService.getWithId(id);
  }

  @Patch(':id')
  postsIdPatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() postsIdPatchRequest: PostsIdPatchRequest,
  ): Post {
    return this.postsService.updateWithId(id, postsIdPatchRequest);
  }
}
