import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WishSentLog } from './WishSentLog.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  first_name!: string;

  @Column({ type: 'varchar', length: 100 })
  last_name!: string;

  @Column({ type: 'date' })
  date_of_birth!: Date;

  @Column({ type: 'varchar', length: 255 })
  location!: string;

  @Column({ type: 'varchar', length: 100 })
  timezone!: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at!: Date;

  @OneToMany(() => WishSentLog, wishSentLog => wishSentLog.user)
  wishSentLogs!: WishSentLog[];
}
