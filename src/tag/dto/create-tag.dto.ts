import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDealDto } from '../../deal/dto/create-deal.dto';
import { CreateSupplyDto } from '../../supply/dto/create-supply.dto';

export class CreateTagDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  tagUrl: string;

  @ApiProperty({
    type: CreateDealDto,
  })
  @IsNotEmpty()
  deal: CreateDealDto;

  @ApiProperty({
    type: CreateSupplyDto,
  })
  @IsOptional()
  supply: CreateSupplyDto;
}
