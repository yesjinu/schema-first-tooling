import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Represents a single blog post' })
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  body: string;
}
