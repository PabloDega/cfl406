import { Sequelize } from 'sequelize';

import defineAreas from './Areas.model.js';
import defineAlumnos from './Alumnos.model.js';
import defineClase from './Clase.model.js';
import defineCursos from './Cursos.model.js';
import defineDocentes from './Docentes.model.js';
import defineEstadosInscripcion from './EstadosInscripcion.model.js';
import defineInscripciones from './Inscripciones.model.js';
import defineLocalidades from './Localidades.model.js';
import defineModalidad from './Modalidad.model.js';
import defineNacionalidades from './Nacionalidades.model.js';
import defineProvincias from './Provincias.model.js';
import defineSede from './Sede.model.js';
import defineSexosGeneros from './SexosGeneros.model.js';
import defineTiposDocumento from './TiposDocumento.model.js';
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
    timezone: '-03:00'
  }
);

const Areas = defineAreas(sequelize);
const Alumnos = defineAlumnos(sequelize);
const Clase = defineClase(sequelize);
const Cursos = defineCursos(sequelize);
const Docentes = defineDocentes(sequelize);
const EstadosInscripcion = defineEstadosInscripcion(sequelize);
const Inscripciones = defineInscripciones(sequelize);
const Localidades = defineLocalidades(sequelize);
const Modalidad = defineModalidad(sequelize);
const Nacionalidades = defineNacionalidades(sequelize);
const Provincias = defineProvincias(sequelize);
const Sede = defineSede(sequelize);
const SexosGeneros = defineSexosGeneros(sequelize);
const TiposDocumento = defineTiposDocumento(sequelize);
const Titulo = defineTitulo(sequelize);
const Users = defineUser(sequelize);

Cursos.belongsTo(Areas, { foreignKey: 'area' });
Cursos.belongsTo(Sede, { foreignKey: 'sede' });
Cursos.belongsTo(Titulo, { foreignKey: 'titulo' });
Cursos.belongsTo(Modalidad, { foreignKey: 'modalidad' });
Cursos.belongsTo(Docentes, { foreignKey: 'docente_id' });

Alumnos.belongsTo(TiposDocumento, { foreignKey: 'tipo_documento_id' });
Alumnos.belongsTo(SexosGeneros, { foreignKey: 'sexo_genero_id' });
Alumnos.belongsTo(Nacionalidades, { foreignKey: 'nacionalidad_id' });
Alumnos.belongsTo(Provincias, { foreignKey: 'provincia_id' });
Alumnos.belongsTo(Localidades, { foreignKey: 'localidad_id' });

Localidades.belongsTo(Provincias, { foreignKey: 'provincia_id' });

Inscripciones.belongsTo(Alumnos, { foreignKey: 'alumno_id' });
Inscripciones.belongsTo(Cursos, { foreignKey: 'curso_id' });
Inscripciones.belongsTo(EstadosInscripcion, { foreignKey: 'estado_inscripcion_id' });

Areas.hasMany(Cursos, { foreignKey: 'area' });
Sede.hasMany(Cursos, { foreignKey: 'sede' });
Titulo.hasMany(Cursos, { foreignKey: 'titulo' });
Modalidad.hasMany(Cursos, { foreignKey: 'modalidad' });
Docentes.hasMany(Cursos, { foreignKey: 'docente_id' });

TiposDocumento.hasMany(Alumnos, { foreignKey: 'tipo_documento_id' });
SexosGeneros.hasMany(Alumnos, { foreignKey: 'sexo_genero_id' });
Nacionalidades.hasMany(Alumnos, { foreignKey: 'nacionalidad_id' });
Provincias.hasMany(Alumnos, { foreignKey: 'provincia_id' });
Provincias.hasMany(Localidades, { foreignKey: 'provincia_id' });
Localidades.hasMany(Alumnos, { foreignKey: 'localidad_id' });

Alumnos.hasMany(Inscripciones, { foreignKey: 'alumno_id' });
Cursos.hasMany(Inscripciones, { foreignKey: 'curso_id' });
EstadosInscripcion.hasMany(Inscripciones, { foreignKey: 'estado_inscripcion_id' });

export {
  sequelize,
  Areas,
  Alumnos,
  Clase,
  Cursos,
  Docentes,
  EstadosInscripcion,
  Inscripciones,
  Localidades,
  Modalidad,
  Nacionalidades,
  Provincias,
  Sede,
  SexosGeneros,
  TiposDocumento,
  Titulo,
  Users
};
