import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define(
  'Alumnos',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo_documento_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    documento: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    apellido: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    sexo_genero_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    nacionalidad_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    provincia_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    localidad_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    calle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    numero: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    piso: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    depto: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cp: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    domicilio_texto: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    fecha_alta: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    activo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    eliminado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'alumnos',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['documento'] },
      { fields: ['apellido', 'nombre'] },
      { fields: ['tipo_documento_id'] },
      { fields: ['provincia_id'] },
      { fields: ['localidad_id'] },
      { fields: ['sexo_genero_id'] },
      { fields: ['nacionalidad_id'] }
    ]
  }
);
