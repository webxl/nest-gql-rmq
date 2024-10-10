import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Edge } from './edge.model';
import { EdgesService } from './edges.service';
import { CreateEdgeInput } from './dto/create-edge.input';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Resolver(() => Edge)
export class EdgesResolver {
  constructor(
    private readonly edgesService: EdgesService,
    @Inject('CLIENT_PROXY') private readonly client: ClientProxy,
  ) {}

  @Query(() => [Edge])
  async edges(): Promise<Edge[]> {
    const edges = await this.edgesService.getEdges();
    return this.client.send({ cmd: 'edges' }, edges).toPromise();
  }

  @Query(() => Edge)
  async edge(@Args('id') id: string): Promise<Edge> {
    const edge = await this.edgesService.getEdge(id);
    return this.client.send({ cmd: 'edge' }, edge).toPromise();
  }

  @Mutation(() => Edge)
  async createEdge(@Args('edge') edge: CreateEdgeInput) {
    const createdEdge = await this.edgesService.createEdge(edge);
    return this.client.send({ cmd: 'create' }, createdEdge);
  }
}
