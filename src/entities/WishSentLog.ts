import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User.js';

export enum WishStatus {
  SENT = 'sent',
  FAILED = 'failed',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
}

export enum WishType {
  BIRTHDAY = 'birthday',
}

@Entity('wish_sent_logs')
export class WishSentLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.wishSentLogs, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'enum', enum: WishType })
  type!: WishType;

  @Column({ type: 'datetime' })
  sendDate!: Date;

  @Column({ type: 'enum', enum: WishStatus })
  status!: WishStatus;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
