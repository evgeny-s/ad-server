import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDealDto } from '../../deal/dto/create-deal.dto';
import { CreateSupplyDto } from '../../supply/dto/create-supply.dto';
import { Type } from 'class-transformer';

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
  @ValidateNested()
  @Type(() => CreateDealDto)
  deal: CreateDealDto;

  @ApiProperty({
    type: CreateSupplyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSupplyDto)
  supply: CreateSupplyDto;
}
