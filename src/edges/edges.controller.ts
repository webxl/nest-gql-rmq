import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateEdgeInput } from './dto/create-edge.input';
import { EdgesService } from './edges.service';

@Controller()
export class EdgesController {
  constructor(private readonly edgesService: EdgesService) {}

  @MessagePattern({ cmd: 'edges' })
  async handleEdges() {
    return this.edgesService.getEdges();
  }

  @MessagePattern({ cmd: 'edge' })
  async handleEdge(data: string) {
    return await this.edgesService.getEdge(data);
  }

  @MessagePattern({ cmd: 'createEdge' })
  async createEdge(data: CreateEdgeInput) {
    return this.edgesService.createEdge(data);
  }
}
