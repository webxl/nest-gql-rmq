import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { EdgesModule } from './edges/edges.module';
import { Edge } from './edges/edge.entity';
import { Edge as EdgeModel } from './edges/edge.model';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EdgesService } from './edges/edges.service';
import { INestApplication } from '@nestjs/common';
import sqlite3 from 'sqlite3';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

describe('Edges Integration', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let edgeRepository: Repository<Edge>;
  let edgeService: EdgesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Edge],
          synchronize: true,
          driver: sqlite3,
        }),
        EdgesModule,
        ClientsModule.register([
          {
            name: 'EDGE_TEST_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [RABBITMQ_URL],
              queue: 'edges_test_queue',
              queueOptions: {
                durable: false,
              },
            },
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'edges_test_queue',
        queueOptions: {
          durable: false,
          timeoutMs: 10000,
        },
      },
    });

    await app.startAllMicroservices();
    await app.init();

    client = app.get<ClientProxy>('EDGE_TEST_SERVICE');
    await client.connect();

    edgeRepository = moduleFixture.get<Repository<Edge>>(
      getRepositoryToken(Edge),
    );
    edgeService = moduleFixture.get<EdgesService>(EdgesService);
  }, 30000);

  afterAll(async () => {
    await app.close();
    await client.close();
  });

  it('should retrieve an edge', async () => {
    const mockEdge = {
      id: '123',
      capacity: 10000,
      node1_alias: 'node1',
      node2_alias: 'node2',
    };
    await edgeRepository.save(mockEdge);

    const savedEdge = await edgeRepository.findOne({ where: { id: '123' } });
    expect(savedEdge).toEqual(expect.objectContaining(mockEdge));

    // test controller
    const result = await client.send({ cmd: 'edge' }, '123').toPromise();
    expect(result).toBeDefined();
    expect(new EdgeModel(result)).toEqual(new EdgeModel(mockEdge));
  });

  it('should retrieve all edges', async () => {
    const mockEdges = [
      {
        id: '123',
        capacity: 10000,
        node1_alias: 'node1',
        node2_alias: 'node2',
      },
      {
        id: '456',
        capacity: 20000,
        node1_alias: 'node3',
        node2_alias: 'node4',
      },
    ];
    await edgeRepository.save(mockEdges);
    const savedEdges = await edgeRepository.find();
    expect(savedEdges.length).toEqual(2);
    expect(savedEdges[0].node1_alias).toEqual(mockEdges[0].node1_alias);
    expect(savedEdges[1].node1_alias).toEqual(mockEdges[1].node1_alias);

    // test controller
    const result = await client.send({ cmd: 'edges' }, '').toPromise();
    expect(result).toBeDefined();
    expect(result.length).toEqual(2);
    expect(new EdgeModel(result[0])).toEqual(new EdgeModel(savedEdges[0]));
    expect(new EdgeModel(result[1])).toEqual(new EdgeModel(savedEdges[1]));
  });

  it('should create an edge', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const mockEdge = {
      id: '456',
      node1_alias: 'node3',
      node2_alias: 'node4',
    };
    await edgeService.createEdge(mockEdge);
    const savedEdge = await edgeRepository.findOne({ where: { id: '456' } });
    expect(savedEdge?.node1_alias).toEqual(mockEdge.node1_alias + '-updated');
    expect(savedEdge?.node2_alias).toEqual(mockEdge.node2_alias + '-updated');
    expect(savedEdge?.capacity).toBeGreaterThanOrEqual(10000);
    expect(savedEdge?.capacity).toBeLessThanOrEqual(1000000);
    expect(console.log).toHaveBeenCalledWith(
      `New channel between ${mockEdge.node1_alias} and ${mockEdge.node2_alias} with a capacity of ${savedEdge?.capacity} has been created.`,
    );

    // test controller;
    const result = await client
      .send(
        { cmd: 'createEdge' },
        { node1_alias: 'node5', node2_alias: 'node6' },
      )
      .toPromise();
    expect(result).toBeDefined();
    expect(result.node1_alias).toEqual('node5-updated');
    expect(result.node2_alias).toEqual('node6-updated');
  });
});
