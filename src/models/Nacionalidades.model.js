import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Nacionalidades',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    activo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    tableName: 'nacionalidades',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['codigo'] },
      { unique: true, fields: ['nombre'] }
    ]
  }
);
