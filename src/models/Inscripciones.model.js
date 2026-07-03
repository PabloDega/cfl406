import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Inscripciones',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado_inscripcion_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_inscripcion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fecha_baja: {
      type: DataTypes.DATEONLY,
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
    tableName: 'inscripciones',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['alumno_id', 'curso_id'] },
      { fields: ['curso_id'] },
      { fields: ['estado_inscripcion_id'] },
      { fields: ['fecha_inscripcion'] }
    ]
  }
);
