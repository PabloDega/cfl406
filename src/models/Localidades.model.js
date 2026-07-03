import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Localidades',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    provincia_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    codigo_postal: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    activo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    tableName: 'localidades',
    timestamps: false,
    indexes: [
      { fields: ['provincia_id'] },
      { unique: true, fields: ['provincia_id', 'nombre'] }
    ]
  }
);
