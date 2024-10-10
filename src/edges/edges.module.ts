import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EdgesResolver } from './edges.resolver';
import { EdgesService } from './edges.service';
import { Edge } from './edge.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdgesController } from './edges.controller';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

@Module({
  imports: [
    TypeOrmModule.forFeature([Edge]),
    ClientsModule.register([
      {
        name: 'CLIENT_PROXY',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'edges_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [EdgesController],
  providers: [EdgesResolver, EdgesService],
})
export class EdgesModule {}
