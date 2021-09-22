import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { Supply } from './supply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supply])],
  controllers: [SupplyController],
  providers: [SupplyService],
  exports: [SupplyService],
})
export class SupplyModule {}
