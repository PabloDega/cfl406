import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Clase',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    objeto: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    clase: {
      type: DataTypes.JSON,
      allowNull: false
    },
    observaciones: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: 'clases',
    timestamps: false
  }
);
