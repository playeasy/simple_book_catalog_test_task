import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class BookInput {
  @Field()
  title: string;

  @Field(() => [])
  authorIds: [number];
}
