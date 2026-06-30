import { Sequelize } from 'sequelize';

import defineAreas from './Areas.model.js';
import defineClase from './Clase.model.js';
import defineCursos from './Cursos.model.js';
import defineDocentes from './Docentes.model.js';
import defineModalidad from './Modalidad.model.js';
import defineSede from './Sede.model.js';
import defineTitulo from './Titulo.model.js';
import defineUser from './Users.model.js';

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

const Areas = defineAreas(sequelize);
const Clase = defineClase(sequelize);
const Cursos = defineCursos(sequelize);
const Docentes = defineDocentes(sequelize);
const Modalidad = defineModalidad(sequelize);
const Sede = defineSede(sequelize);
const Titulo = defineTitulo(sequelize);
const Users = defineUser(sequelize);

Cursos.belongsTo(Areas, { foreignKey: 'areas' });
Cursos.belongsTo(Sede, { foreignKey: 'sede' });
Cursos.belongsTo(Titulo, { foreignKey: 'titulo' });
Cursos.belongsTo(Modalidad, { foreignKey: 'modalidad' });
Cursos.belongsTo(Docentes, { foreignKey: 'docente_id' });

Areas.hasMany(Cursos, { foreignKey: 'areas' });
Sede.hasMany(Cursos, { foreignKey: 'sede' });
Titulo.hasMany(Cursos, { foreignKey: 'titulo' });
Modalidad.hasMany(Cursos, { foreignKey: 'modalidad' });
Docentes.hasMany(Cursos, { foreignKey: 'docente_id' });

export {
  sequelize,
  Areas,
  Clase,
  Cursos,
  Docentes,
  Modalidad,
  Sede,
  Titulo,
  Users
};
