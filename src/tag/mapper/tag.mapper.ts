import { Tag } from '../tag.entity';
import { TagDto } from '../dto/tag.dto';
import { toDealDto } from '../../deal/mapper/deal.mapper';
import { toSupplyDto } from '../../supply/mapper/supply.mapper';

export const toTagDto = (data: Tag): TagDto => {
  const { id, name, tagUrl, deal, supply } = data;

  return {
    id,
    name,
    tagUrl,
    deal: deal ? toDealDto(deal) : null,
    supply: supply ? toSupplyDto(supply) : null,
  };
};
