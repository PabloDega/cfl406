import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'SexosGeneros',
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
      allowNull: false
    },
    activo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    tableName: 'sexos_generos',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['codigo'] }
    ]
  }
);
