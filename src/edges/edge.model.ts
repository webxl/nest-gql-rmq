import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Edge {
  constructor(partial: Partial<Edge>) {
    if (typeof partial.create_at === 'string') {
      partial.create_at = new Date(partial.create_at);
    }
    if (typeof partial.update_at === 'string') {
      partial.update_at = new Date(partial.update_at);
    }
    Object.assign(this, partial);
  }

  @Field(() => String)
  id: string;

  @Field(() => Date)
  create_at: Date;

  @Field(() => Date)
  update_at: Date;

  @Field(() => Int)
  capacity: number;

  @Field(() => String)
  node1_alias: string;

  @Field(() => String)
  node2_alias: string;

  @Field(() => String)
  edge_peers: string;
}
