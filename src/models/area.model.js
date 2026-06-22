import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Area',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    area: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    observaciones: {
      type: DataTypes.JSON,
      allowNull: true
    },
    eliminado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'areas',
    timestamps: false
  }
);
