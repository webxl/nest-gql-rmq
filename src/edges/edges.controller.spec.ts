import { Test, TestingModule } from '@nestjs/testing';
import { EdgesController } from './edges.controller';
import { EdgesService } from './edges.service';
import { Edge } from './edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';

describe('EdgesController', () => {
  let controller: EdgesController;
  let service: EdgesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdgesController],
      providers: [
        {
          provide: EdgesService,
          useValue: {
            getEdge: jest.fn(),
            getEdges: jest.fn(),
            createEdge: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EdgesController>(EdgesController);
    service = module.get<EdgesService>(EdgesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleEdge', () => {
    it('should call edgesService.getEdge with the correct id', async () => {
      const mockEdge: Edge = {
        id: '123',
        capacity: 100,
        create_at: new Date(),
        update_at: new Date(),
        node1_alias: 'peer1',
        node2_alias: 'peer2',
        edge_peers: 'peer1-peer2',
      };
      jest.spyOn(service, 'getEdge').mockResolvedValue(mockEdge);

      const result = await controller.handleEdge('123');

      expect(service.getEdge).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockEdge);
    });
  });

  describe('handleEdges', () => {
    it('should call edgesService.getEdges', async () => {
      const mockEdges: Edge[] = [
        {
          id: '123',
          capacity: 100,
          create_at: new Date(),
          update_at: new Date(),
          node1_alias: 'peer1',
          node2_alias: 'peer2',
          edge_peers: 'peer1-peer2',
        },
      ];
      jest.spyOn(service, 'getEdges').mockResolvedValue(mockEdges);

      const result = await controller.handleEdges();

      expect(service.getEdges).toHaveBeenCalled();
      expect(result).toEqual(mockEdges);
    });
  });

  describe('createEdge', () => {
    it('should call edgesService.createEdge with the correct data', async () => {
      const mockEdge: CreateEdgeInput = {
        node1_alias: 'peer1',
        node2_alias: 'peer2',
      };
      const mockResult = {
        ...mockEdge,
        id: '123',
        create_at: new Date(),
        update_at: new Date(),
        capacity: 100,
        edge_peers: 'peer1-peer2',
      };
      jest.spyOn(service, 'createEdge').mockResolvedValue(mockResult);

      const result = await controller.createEdge(mockEdge);

      expect(service.createEdge).toHaveBeenCalledWith(mockEdge);
      expect(result).toEqual(mockResult);
    });
  });
});
