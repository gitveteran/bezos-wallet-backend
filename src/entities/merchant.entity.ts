import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Ensures no duplicate merchants
  merchant: string;

  @Column({ default: true }) // Defaults to "Bezos-related" when added
  isBezosRelated: boolean;
}
