import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Supply } from '../supply/supply.entity';
import { Deal } from '../deal/deal.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  tagUrl: string;

  @ManyToOne(() => Supply, supply => supply.tags)
  @JoinColumn()
  supply: Supply;

  @ManyToOne(() => Deal, deal => deal.tags)
  @JoinColumn()
  deal: Deal;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
