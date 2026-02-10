import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Sede',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    direccion: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    gmap: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    horarios: {
      type: DataTypes.TEXT('long'),
      allowNull: true
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
    tableName: 'sedes',
    timestamps: false
  }
);
