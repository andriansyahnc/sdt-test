import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @ManyToOne('User', 'wishSentLogs', { onDelete: 'CASCADE' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user!: any;

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
