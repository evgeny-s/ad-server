import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Connection, In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { toTagDto } from './mapper/tag.mapper';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagDto } from './dto/tag.dto';
import { DealService } from '../deal/deal.service';
import { SupplyService } from '../supply/supply.service';

@Injectable()
export class TagService {
  logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepo: Repository<Tag>,
    private connection: Connection,
    @Inject(DealService)
    private readonly dealService: DealService,
    @Inject(SupplyService)
    private readonly supplyService: SupplyService,
  ) {}

  async getCountBySupplyId(supplyId) {
    return this.tagsRepo.count({
      where: {
        supply: {
          id: supplyId
        }
      }
    });
  }

  async getTagsBySupplyIdExcluded(
    supplyId: number,
    excludedIds: number[],
  ): Promise<TagDto[]> {
    const tags = await this.tagsRepo.find({
      where: {
        supply: {
          id: supplyId,
        },
        id: Not(In(excludedIds)),
      },
      relations: ['deal', 'supply'],
      order: {
        createdAt: 'ASC',
      },
    });

    return tags.map((tag) => toTagDto(tag));
  }

  async _findOne(id: number): Promise<Tag> {
    let tag: Tag = await this.tagsRepo.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException(`Item with id: ${id} does not exist.`);
    }

    return tag;
  }

  async getAll(): Promise<TagDto[]> {
    const tags = await this.tagsRepo.find({
      relations: ['deal', 'supply'],
      order: {
        createdAt: 'ASC',
      },
    });

    return tags.map((tag) => toTagDto(tag));
  }

  async getOne(id): Promise<TagDto> {
    const tag = await this._findOne(id);

    return toTagDto(tag);
  }

  async create(createTagDto: CreateTagDto): Promise<TagDto> {
    const { name, tagUrl, deal, supply } = createTagDto;

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    const tag = new Tag();
    try {
      tag.name = name;
      tag.tagUrl = tagUrl;

      tag.deal = await this.dealService._createOrUpdate(deal);

      if (supply) {
        tag.supply = await this.supplyService._createOrUpdate(supply);
      }

      await this.connection.manager.save(tag);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();

      this.logger.error(e);

      throw new NotFoundException('Something went wrong. Try again later.');
    }

    return toTagDto(tag);
  }

  async update(id: number, tagDto: CreateTagDto): Promise<TagDto> {
    const { name } = tagDto;

    let tag = await this._findOne(id);

    await this.tagsRepo.update(
      { id },
      {
        name,
      },
    );

    tag = await this.tagsRepo.findOne({
      where: { id },
    });

    return toTagDto(tag);
  }
}
