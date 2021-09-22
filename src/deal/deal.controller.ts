import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DealService } from './deal.service';
import { DealDto } from './dto/deal.dto';
import { CreateDealDto } from './dto/create-deal.dto';

@Controller('deals')
@ApiTags('Deals')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Get('')
  public async findAll(): Promise<DealDto[]> {
    return this.dealService.getAll();
  }

  @Get('/:id')
  public async findOne(@Param('id') id: number): Promise<DealDto> {
    return this.dealService.getOne(id);
  }

  @Post('')
  public async create(@Body() createDealDto: CreateDealDto): Promise<DealDto> {
    let deal: DealDto;

    try {
      deal = await this.dealService.create(createDealDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    return deal;
  }

  @Put('/:id')
  public async update(
    @Param('id') id: number,
    @Body() createDealDto: CreateDealDto,
  ): Promise<DealDto> {
    let deal: DealDto;

    try {
      deal = await this.dealService.update(id, createDealDto);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      } else {
        throw e;
      }
    }

    return deal;
  }
}
