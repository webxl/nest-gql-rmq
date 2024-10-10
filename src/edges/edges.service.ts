import { Injectable } from '@nestjs/common';
import { Edge } from './edge.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEdgeInput } from './dto/create-edge.input';

@Injectable()
export class EdgesService {
  constructor(
    @InjectRepository(Edge)
    private edgeRepository: Repository<Edge>,
  ) {}

  async getEdges(): Promise<Edge[]> {
    return this.edgeRepository.find();
  }

  async getEdge(id: string): Promise<Edge | null> {
    return this.edgeRepository.findOne({ where: { id } });
  }

  async createEdge(edge: CreateEdgeInput): Promise<Edge> {
    const newEdge = this.edgeRepository.create(edge);
    newEdge.capacity = 10000 + Math.floor(Math.random() * 999000);
    newEdge.node1_alias = edge.node1_alias + '-updated';
    newEdge.node2_alias = edge.node2_alias + '-updated';
    const result = await this.edgeRepository.save(newEdge);
    console.log(
      `New channel between ${edge.node1_alias} and ${edge.node2_alias} with a capacity of ${result.capacity} has been created.`,
    );
    return result;
  }
}
