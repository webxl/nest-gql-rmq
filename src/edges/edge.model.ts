import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Edge {
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
