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
import { TagDto } from './dto/tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';

@Controller('tags')
@ApiTags('Tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('')
  public async findAll(): Promise<TagDto[]> {
    return this.tagService.getAll();
  }

  @Get('/:id')
  public async findOne(@Param('id') id: number): Promise<TagDto> {
    return this.tagService.getOne(id);
  }

  @Post('')
  public async create(@Body() createTagDto: CreateTagDto): Promise<TagDto> {
    let tag: TagDto;

    try {
      tag = await this.tagService.create(createTagDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    return tag;
  }

  @Put('/:id')
  public async update(
    @Param('id') id: number,
    @Body() createTagDto: CreateTagDto,
  ): Promise<TagDto> {
    let tag: TagDto;

    try {
      tag = await this.tagService.update(id, createTagDto);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      } else {
        throw e;
      }
    }

    return tag;
  }
}
