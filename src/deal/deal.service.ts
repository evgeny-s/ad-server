import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from './deal.entity';
import { DealDto } from './dto/deal.dto';
import { toDealDto } from './mapper/deal.mapper';
import { CreateDealDto } from './dto/create-deal.dto';

@Injectable()
export class DealService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealsRepo: Repository<Deal>,
  ) {}

  async _findOne(id: number): Promise<Deal> {
    let deal: Deal = await this.dealsRepo.findOne({ where: { id } });

    if (!deal) {
      throw new NotFoundException(`Item with id: ${id} does not exist.`);
    }

    return deal;
  }

  async getAll(): Promise<DealDto[]> {
    const deals = await this.dealsRepo.find({
      relations: ['tags'],
      order: {
        createdAt: 'ASC',
      },
    });

    return deals.map((deal) => toDealDto(deal));
  }

  async getOne(id): Promise<DealDto> {
    const deal = await this._findOne(id);

    return toDealDto(deal);
  }

  async _createOrUpdate(createDealDto: CreateDealDto): Promise<Deal> {
    const { id, name } = createDealDto;

    let deal: Deal;

    if (id) {
      deal = await this._findOne(id);
    } else {
      deal = new Deal();
    }

    deal.name = name;

    return this.dealsRepo.save(deal);
  }

  async create(createDealDto: CreateDealDto): Promise<DealDto> {
    return toDealDto(await this._createOrUpdate(createDealDto));
  }

  async update(id: number, dealDto: CreateDealDto): Promise<DealDto> {
    return toDealDto(await this._createOrUpdate(dealDto));
  }
}
