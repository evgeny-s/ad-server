import { ApiProperty } from '@nestjs/swagger';
import { TagDto } from '../../tag/dto/tag.dto';

export class DealDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tags: TagDto[];
}
