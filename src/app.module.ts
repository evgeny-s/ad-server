import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { AdModule } from './ad/ad.module';
import { DatabaseModule } from './database/database.module';
import { DealModule } from './deal/deal.module';
import { SupplyModule } from './supply/supply.module';

@Module({
  imports: [
    SupplyModule,
    DealModule,
    TagModule,
    AdModule,
    DatabaseModule,
    AdModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
