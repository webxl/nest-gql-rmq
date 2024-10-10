import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
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
  async handleEdge(data: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    const result = await this.edgesService.getEdge(data);

    channel.sendToQueue(
      originalMsg.properties.replyTo,
      Buffer.from(JSON.stringify(result)),
      { correlationId: originalMsg.properties.correlationId },
    );

    return result;
  }

  @MessagePattern({ cmd: 'createEdge' })
  createEdge(data: CreateEdgeInput) {
    return this.edgesService.createEdge(data);
  }
}
