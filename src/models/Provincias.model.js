import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Provincias',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(10),
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
    tableName: 'provincias',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['codigo'] },
      { unique: true, fields: ['nombre'] }
    ]
  }
);
