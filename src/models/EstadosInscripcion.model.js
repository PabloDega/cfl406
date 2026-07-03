import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'EstadosInscripcion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    orden: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1
    },
    activo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    tableName: 'estados_inscripcion',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['codigo'] },
      { fields: ['orden'] }
    ]
  }
);
