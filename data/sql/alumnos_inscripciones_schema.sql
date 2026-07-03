-- Esquema base para alumnos e inscripciones (MySQL / MariaDB)
-- Listo para ejecutar en phpMyAdmin

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS provincias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(10) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_provincias_codigo (codigo),
  UNIQUE KEY uq_provincias_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS localidades (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provincia_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  codigo_postal VARCHAR(20) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_localidades_provincia (provincia_id),
  UNIQUE KEY uq_localidad_provincia_nombre (provincia_id, nombre),
  CONSTRAINT fk_localidades_provincias
    FOREIGN KEY (provincia_id) REFERENCES provincias (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tipos_documento (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(20) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tipos_documento_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sexos_generos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(20) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sexos_generos_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nacionalidades (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(20) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_nacionalidades_codigo (codigo),
  UNIQUE KEY uq_nacionalidades_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS estados_inscripcion (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  orden SMALLINT NOT NULL DEFAULT 1,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_estados_inscripcion_codigo (codigo),
  KEY idx_estados_inscripcion_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS alumnos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo_documento_id INT UNSIGNED NOT NULL,
  documento VARCHAR(30) NOT NULL,
  apellido VARCHAR(150) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  fecha_nacimiento DATE NULL,
  sexo_genero_id INT UNSIGNED NULL,
  telefono VARCHAR(50) NULL,
  email VARCHAR(150) NULL,
  nacionalidad_id INT UNSIGNED NULL,
  provincia_id INT UNSIGNED NULL,
  localidad_id INT UNSIGNED NULL,
  calle VARCHAR(255) NULL,
  numero VARCHAR(20) NULL,
  piso VARCHAR(20) NULL,
  depto VARCHAR(20) NULL,
  cp VARCHAR(20) NULL,
  domicilio_texto TEXT NULL,
  observaciones TEXT NULL,
  fecha_alta DATE NOT NULL DEFAULT (CURRENT_DATE),
  activo TINYINT(1) NOT NULL DEFAULT 1,
  eliminado TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_alumnos_documento (documento),
  KEY idx_alumnos_apellido_nombre (apellido, nombre),
  KEY idx_alumnos_tipo_documento (tipo_documento_id),
  KEY idx_alumnos_provincia (provincia_id),
  KEY idx_alumnos_localidad (localidad_id),
  KEY idx_alumnos_sexo_genero (sexo_genero_id),
  KEY idx_alumnos_nacionalidad (nacionalidad_id),
  CONSTRAINT fk_alumnos_tipos_documento
    FOREIGN KEY (tipo_documento_id) REFERENCES tipos_documento (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_alumnos_sexos_generos
    FOREIGN KEY (sexo_genero_id) REFERENCES sexos_generos (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_alumnos_nacionalidades
    FOREIGN KEY (nacionalidad_id) REFERENCES nacionalidades (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_alumnos_provincias
    FOREIGN KEY (provincia_id) REFERENCES provincias (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_alumnos_localidades
    FOREIGN KEY (localidad_id) REFERENCES localidades (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inscripciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  alumno_id INT UNSIGNED NOT NULL,
  curso_id INT NOT NULL,
  estado_inscripcion_id INT UNSIGNED NOT NULL,
  fecha_inscripcion DATE NOT NULL DEFAULT (CURRENT_DATE),
  fecha_baja DATE NULL,
  observaciones TEXT NULL,
  eliminado TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inscripciones_alumno_curso (alumno_id, curso_id),
  KEY idx_inscripciones_curso (curso_id),
  KEY idx_inscripciones_estado (estado_inscripcion_id),
  KEY idx_inscripciones_fecha (fecha_inscripcion),
  CONSTRAINT fk_inscripciones_alumnos
    FOREIGN KEY (alumno_id) REFERENCES alumnos (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_inscripciones_cursos
    FOREIGN KEY (curso_id) REFERENCES cursos (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_inscripciones_estados
    FOREIGN KEY (estado_inscripcion_id) REFERENCES estados_inscripcion (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Carga basica de catalogos
INSERT INTO tipos_documento (id, codigo, nombre, activo) VALUES
  (1, 'DNI', 'Documento Nacional de Identidad', 1),
  (2, 'PAS', 'Pasaporte', 1),
  (3, 'LC', 'Libreta Civica', 1),
  (4, 'LE', 'Libreta de Enrolamiento', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), activo = VALUES(activo);

INSERT INTO sexos_generos (id, codigo, nombre, activo) VALUES
  (1, 'F', 'Femenino', 1),
  (2, 'M', 'Masculino', 1),
  (3, 'X', 'No binario / Otro', 1),
  (4, 'ND', 'Prefiere no declarar', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), activo = VALUES(activo);

INSERT INTO nacionalidades (id, codigo, nombre, activo) VALUES
  (1, 'AR', 'Argentina', 1),
  (2, 'UY', 'Uruguaya', 1),
  (3, 'PY', 'Paraguaya', 1),
  (4, 'BO', 'Boliviana', 1),
  (5, 'CL', 'Chilena', 1),
  (6, 'PE', 'Peruana', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), activo = VALUES(activo);

INSERT INTO estados_inscripcion (id, codigo, nombre, orden, activo) VALUES
  (1, 'preinscripto', 'Preinscripto', 1, 1),
  (2, 'confirmado', 'Confirmado', 2, 1),
  (3, 'en_curso', 'En curso', 3, 1),
  (4, 'baja', 'Baja', 4, 1),
  (5, 'egresado', 'Egresado', 5, 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), orden = VALUES(orden), activo = VALUES(activo);

INSERT INTO provincias (id, codigo, nombre, activo) VALUES
  (1, 'CABA', 'Ciudad Autonoma de Buenos Aires', 1),
  (2, 'BA', 'Buenos Aires', 1),
  (3, 'CBA', 'Cordoba', 1),
  (4, 'SF', 'Santa Fe', 1),
  (5, 'MZA', 'Mendoza', 1),
  (6, 'TUC', 'Tucuman', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), activo = VALUES(activo);

INSERT INTO localidades (id, provincia_id, nombre, codigo_postal, activo) VALUES
  (1, 1, 'Caballito', '1405', 1),
  (2, 1, 'Palermo', '1425', 1),
  (3, 1, 'Flores', '1406', 1),
  (4, 2, 'La Plata', '1900', 1),
  (5, 2, 'Mar del Plata', '7600', 1),
  (6, 2, 'San Martin', '1650', 1),
  (7, 3, 'Cordoba Capital', '5000', 1),
  (8, 3, 'Villa Carlos Paz', '5152', 1),
  (9, 4, 'Rosario', '2000', 1),
  (10, 4, 'Santa Fe Capital', '3000', 1),
  (11, 5, 'Mendoza Capital', '5500', 1),
  (12, 5, 'Godoy Cruz', '5501', 1),
  (13, 6, 'San Miguel de Tucuman', '4000', 1)
ON DUPLICATE KEY UPDATE codigo_postal = VALUES(codigo_postal), activo = VALUES(activo);

SET FOREIGN_KEY_CHECKS = 1;
