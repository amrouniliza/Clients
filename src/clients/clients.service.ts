import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Client } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createClientDto: Prisma.ClientCreateInput) {
    this.logger.log('Creating a new client', createClientDto);
    return this.databaseService.client.create({ data: createClientDto });
  }

  async findAll() {
    this.logger.log('Fetching all clients');
    return this.databaseService.client.findMany();
  }

  async findOne(id: number): Promise<Client | null> {
    this.logger.log(`Fetching client with ID ${id}`);
    const client = await this.databaseService.client.findUnique({
      where: { id },
    });
    if (!client) {
      this.logger.warn(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(
    id: number,
    updateClientDto: Prisma.ClientUpdateInput,
  ): Promise<Client> {
    this.logger.log(`Updating client with ID ${id}`, updateClientDto);
    const existingClient = await this.findOne(id);
    if (!existingClient) {
      this.logger.warn(`Client with ID ${id} not found`);
      return null;
    }
    return this.databaseService.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: number): Promise<Client> {
    this.logger.log(`Removing client with ID ${id}`);
    const existingClient = await this.findOne(id);
    if (!existingClient) {
      this.logger.warn(`Client with ID ${id} not found`);
      return null;
    }
    return this.databaseService.client.delete({ where: { id } });
  }
}
