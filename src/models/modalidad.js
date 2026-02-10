import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Modalidad',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    modalidad: {
      type: DataTypes.STRING(255),
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
    tableName: 'modalidades',
    timestamps: false
  }
);
