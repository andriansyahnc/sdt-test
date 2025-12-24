import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';


export enum WishType {
  BIRTHDAY = 'birthday',
}

export enum WishStatus {
  SENT = 'sent',
  FAILED = 'failed',
}

interface WishSentLogAttributes {
  id: number;
  userId: number;
  type: WishType;
  status: WishStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WishSentLogCreationAttributes extends Optional<WishSentLogAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class WishSentLog extends Model<WishSentLogAttributes, WishSentLogCreationAttributes> implements WishSentLogAttributes {
  public id!: number;
  public userId!: number;
  public type!: WishType;
  public status!: WishStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WishSentLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM(...Object.values(WishType)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(WishStatus)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'WishSentLog',
    tableName: 'wish_sent_logs',
    indexes: [
      { fields: ['userId'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['userId', 'type', 'createdAt'] },
    ],
  }
);

User.hasMany(WishSentLog, { foreignKey: 'userId' });
WishSentLog.belongsTo(User, { foreignKey: 'userId' });
