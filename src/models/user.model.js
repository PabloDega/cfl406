import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    observaciones: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    eliminado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'users',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['user'] }
    ]
  }
);
