import { Sequelize } from 'sequelize';

import defineArea from './area.js';
import defineClase from './clase.js';
import defineCurso from './curso.js';
import defineDocente from './docente.js';
import defineModalidad from './modalidad.js';
import defineSede from './sede.js';
import defineTitulo from './titulo.js';
import defineUser from './user.js';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00'
  }
);

const Area = defineArea(sequelize);
const Clase = defineClase(sequelize);
const Curso = defineCurso(sequelize);
const Docente = defineDocente(sequelize);
const Modalidad = defineModalidad(sequelize);
const Sede = defineSede(sequelize);
const Titulo = defineTitulo(sequelize);
const User = defineUser(sequelize);

Curso.belongsTo(Area, { foreignKey: 'area' });
Curso.belongsTo(Sede, { foreignKey: 'sede' });
Curso.belongsTo(Titulo, { foreignKey: 'titulo' });
Curso.belongsTo(Modalidad, { foreignKey: 'modalidad' });
Curso.belongsTo(Docente, { foreignKey: 'docente_id' });

Area.hasMany(Curso, { foreignKey: 'area' });
Sede.hasMany(Curso, { foreignKey: 'sede' });
Titulo.hasMany(Curso, { foreignKey: 'titulo' });
Modalidad.hasMany(Curso, { foreignKey: 'modalidad' });
Docente.hasMany(Curso, { foreignKey: 'docente_id' });

export {
  sequelize,
  Area,
  Clase,
  Curso,
  Docente,
  Modalidad,
  Sede,
  Titulo,
  User
};
