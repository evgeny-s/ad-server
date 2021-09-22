import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplyDto } from './dto/supply.dto';
import { Supply } from './supply.entity';
import { toSupplyDto } from './mapper/supply.mapper';
import { CreateSupplyDto } from './dto/create-supply.dto';

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(Supply)
    private readonly suppplyRepo: Repository<Supply>,
  ) {}

  async _findOne(id: number): Promise<Supply> {
    let supply: Supply = await this.suppplyRepo.findOne({ where: { id } });

    if (!supply) {
      throw new NotFoundException(`Item with id: ${id} does not exist.`);
    }

    return supply;
  }

  async getAll(): Promise<SupplyDto[]> {
    const supplyItems = await this.suppplyRepo.find({
      relations: ['tags'],
      order: {
        createdAt: 'ASC',
      },
    });

    return supplyItems.map((supply) => toSupplyDto(supply));
  }

  async getOne(id): Promise<SupplyDto> {
    const supply = await this._findOne(id);

    return toSupplyDto(supply);
  }

  async _createOrUpdate(createSupplyDto: CreateSupplyDto): Promise<Supply> {
    const { id, name } = createSupplyDto;

    let supply: Supply;

    if (id) {
      supply = await this._findOne(id);
    } else {
      supply = new Supply();
    }

    supply.name = name;

    return this.suppplyRepo.save(supply);
  }

  async create(createSupplyDto: CreateSupplyDto): Promise<SupplyDto> {
    return toSupplyDto(await this._createOrUpdate(createSupplyDto));
  }

  async update(id: number, supplyDto: CreateSupplyDto): Promise<SupplyDto> {
    return toSupplyDto(await this._createOrUpdate(supplyDto));
  }
}
