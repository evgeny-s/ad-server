import { ApiProperty } from '@nestjs/swagger';
import { SupplyDto } from '../../supply/dto/supply.dto';
import { DealDto } from '../../deal/dto/deal.dto';

export class TagDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tagUrl: string;

  @ApiProperty()
  supply: SupplyDto;

  @ApiProperty()
  deal: DealDto;
}
