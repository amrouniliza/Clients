import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { Prisma, Client } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

const mockDatabaseService = {
  client: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ClientsService', () => {
  let service: ClientsService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createClientDto: Prisma.ClientCreateInput = {
        firstName: 'Test Client',
        lastName: 'Last Name',
        email: 'test@example.com',
      };
      const result = { id: 1, ...createClientDto };

      jest
        .spyOn(databaseService.client, 'create')
        .mockResolvedValue(result as Client);

      expect(await service.create(createClientDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result = [
        {
          id: 1,
          firstName: 'Test',
          lastName: 'Client',
          email: 'test@example.com',
          phoneNumber: '1234567890',
          address: '123 Test Street',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(databaseService.client, 'findMany')
        .mockResolvedValue(result as Client[]);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single client', async () => {
      const result: Client = {
        id: 1,
        firstName: 'Test',
        lastName: 'Client',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        address: '123 Test Street',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(databaseService.client, 'findUnique')
        .mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
    });

    it('should return null if client is not found', async () => {
      jest.spyOn(databaseService.client, 'findUnique').mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updateClientDto: Prisma.ClientUpdateInput = {
        firstName: 'Updated Client',
      };
      const existingClient: Client = {
        id: 1,
        firstName: 'Test',
        lastName: 'Client',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        address: '123 Test Street',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = { ...existingClient, ...updateClientDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingClient);
      jest
        .spyOn(databaseService.client, 'update')
        .mockResolvedValue(result as Client);

      expect(await service.update(1, updateClientDto)).toEqual(result);
    });

    it('should return null if client to update is not found', async () => {
      const updateClientDto: Prisma.ClientUpdateInput = {
        firstName: 'Updated Client',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await service.update(1, updateClientDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      const existingClient: Client = {
        id: 1,
        firstName: 'Test',
        lastName: 'Client',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        address: '123 Test Street',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingClient);
      jest
        .spyOn(databaseService.client, 'delete')
        .mockResolvedValue(existingClient);

      expect(await service.remove(1)).toEqual(existingClient);
    });

    it('should return null if client to remove is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await service.remove(1);
      expect(result).toBeNull();
    });
  });
});
