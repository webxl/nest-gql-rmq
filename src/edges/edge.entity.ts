import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Edge {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @CreateDateColumn()
  @Field()
  create_at: Date;

  @UpdateDateColumn()
  @Field()
  update_at: Date;

  @Column()
  @Field(() => Int)
  capacity: number;

  @Column()
  @Field()
  node1_alias: string;

  @Column()
  @Field()
  node2_alias: string;

  @Field(() => String)
  get edge_peers(): string {
    return `${this.node1_alias}-${this.node2_alias}`;
  }
}
