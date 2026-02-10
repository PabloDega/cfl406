import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Curso',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    activo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    curso: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    area: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sede: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cierre_inscripciones: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    duracion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dias: {
      type: DataTypes.JSON,
      allowNull: false
    },
    horario: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    titulo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modalidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    requisitos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [
        'Ser Mayor de 18 años',
        'Presentar DNI vigente',
        'Presentar titulo primario/secundario completo'
      ]
    },
    temario: {
      type: DataTypes.JSON,
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
    tableName: 'cursos',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['codigo'] },
      { fields: ['area'] },
      { fields: ['sede'] },
      { fields: ['docente_id'] },
      { fields: ['titulo'] },
      { fields: ['modalidad'] }
    ]
  }
);
