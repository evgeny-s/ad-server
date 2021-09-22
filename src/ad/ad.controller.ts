import {
  Controller, Get, Query, Response,
} from '@nestjs/common';
import { AdService } from './ad.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('ad')
@ApiTags('Ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Get('')
  public async getByParams(
    @Query('supplyId') supplyId: number,
    @Response() res
  ): Promise<void> {
    res.set('Content-Type', 'text/xml');
    res.send(await this.adService.getByParams(supplyId)); // TODO: It is better to use xml-body-parser here
  }
}
