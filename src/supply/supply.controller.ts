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
import { SupplyDto } from './dto/supply.dto';
import { SupplyService } from './supply.service';
import { CreateSupplyDto } from './dto/create-supply.dto';

@Controller('supply')
@ApiTags('Supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Get('')
  public async findAll(): Promise<SupplyDto[]> {
    return this.supplyService.getAll();
  }

  @Get('/:id')
  public async findOne(@Param('id') id: number): Promise<SupplyDto> {
    return this.supplyService.getOne(id);
  }

  @Post('')
  public async create(
    @Body() createSupplyDto: CreateSupplyDto,
  ): Promise<SupplyDto> {
    let supply: SupplyDto;

    try {
      supply = await this.supplyService.create(createSupplyDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    return supply;
  }

  @Put('/:id')
  public async update(
    @Param('id') id: number,
    @Body() createSupplyDto: CreateSupplyDto,
  ): Promise<SupplyDto> {
    let supply: SupplyDto;

    try {
      supply = await this.supplyService.update(id, createSupplyDto);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      } else {
        throw e;
      }
    }

    return supply;
  }
}
