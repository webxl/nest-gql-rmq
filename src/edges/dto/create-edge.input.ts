import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEdgeInput {
  @Field()
  node1_alias: string;

  @Field()
  node2_alias: string;
}
