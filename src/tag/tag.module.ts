import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { DealModule } from '../deal/deal.module';
import { SupplyModule } from '../supply/supply.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), DealModule, SupplyModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
