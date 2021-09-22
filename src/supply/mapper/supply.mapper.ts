import { SupplyDto } from '../dto/supply.dto';
import { Supply } from '../supply.entity';
import { toTagDto } from '../../tag/mapper/tag.mapper';
import { TagDto } from '../../tag/dto/tag.dto';
import { Tag } from '../../tag/tag.entity';

export const toSupplyDto = (data: Supply): SupplyDto => {
  const { id, name, tags } = data;

  return {
    id,
    name,
    tags: tags ? tags.map((tag: Tag): TagDto => toTagDto(tag)) : [],
  };
};
