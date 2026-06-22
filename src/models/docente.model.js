import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Docente',
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
    contacto: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    direccion: {
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
    tableName: 'docentes',
    timestamps: false
  }
);
