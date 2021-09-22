import { DealDto } from '../dto/deal.dto';
import { Deal } from '../deal.entity';
import { TagDto } from '../../tag/dto/tag.dto';
import { Tag } from '../../tag/tag.entity';
import { toTagDto } from '../../tag/mapper/tag.mapper';

export const toDealDto = (data: Deal): DealDto => {
  const { id, name, tags } = data;

  return {
    id,
    name,
    tags: tags ? tags.map((tag: Tag): TagDto => toTagDto(tag)) : [],
  };
};
