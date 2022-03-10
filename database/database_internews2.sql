CREATE DATABASE db_internacionalizacion;

USE db_internacionalizacion;

CREATE TABLE users_encargados(
    no_control VARCHAR(25) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    correo_ins VARCHAR(50) NOT NULL,
    contraseña VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    departamento VARCHAR(50) NOT NULL
);

ALTER TABLE users_encargados
	ADD PRIMARY KEY (no_control);

CREATE TABLE users_alumnos(
    no_control VARCHAR(25) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    correo_ins VARCHAR(50) NOT NULL,
    contraseña VARCHAR(50) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    carrera VARCHAR(50) NOT NULL,
    semestre VARCHAR(50) NOT NULL
);

ALTER TABLE users_alumnos
	ADD PRIMARY KEY (no_control);

CREATE TABLE users_docentes(
    no_control VARCHAR(25) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    correo_ins VARCHAR(50) NOT NULL,
    contraseña VARCHAR(50) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    departamento VARCHAR(50) NOT NULL
);

ALTER TABLE users_docentes
	ADD PRIMARY KEY (no_control);
    
CREATE TABLE convocatorias(
	id_conv INT(11) NOT NULL,
    titulo VARCHAR(50),
    imagen VARCHAR(250),
    descripcion TEXT,
    archivo VARCHAR(250),
    pregunta TEXT,
    estado VARCHAR(100),
    carrera VARCHAR(100),
    semestre VARCHAR(100),
    fecha_ini DATE,
    fecha_fin DATE,
    fecha_cre TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM convocatorias;

ALTER TABLE convocatorias
	ADD fecha_ini_repo DATE;
    
ALTER TABLE convocatorias
	ADD fecha_fin_repo DATE;

ALTER TABLE convocatorias
	ADD PRIMARY KEY (id_conv);
    
ALTER TABLE convocatorias
	MODIFY id_conv INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

CREATE TABLE becas(
	id_beca INT(11),
    titulo VARCHAR(50),
    imagen VARCHAR(255),
    descripcion TEXT,
    archivo VARCHAR(255),
    pregunta TEXT,
    estado VARCHAR(100),
    carrera VARCHAR(100),
    semestre VARCHAR(100),
    fecha_ini DATE,
    fecha_fin DATE,
    fecha_cre TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE becas
	ADD PRIMARY KEY (id_beca);
    
ALTER TABLE becas
	MODIFY id_beca INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

CREATE TABLE eventos(
	id_evento INT(11),
    titulo VARCHAR(50),
    imagen VARCHAR(255),
    descripcion TEXT,
    archivo VARCHAR(255),
    pregunta TEXT,
    estado VARCHAR(100),
    carrera VARCHAR(100),
    semestre VARCHAR(100),
    fecha_ini DATE,
    fecha_fin DATE,
    fecha_cre TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE eventos
	ADD PRIMARY KEY (id_evento);

ALTER TABLE eventos
	MODIFY id_evento INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
  
CREATE TABLE reportes_C_A(
	id_repor INT(11) NOT NULL,
    fecha_rea DATE NOT NULL,
    no_control VARCHAR(25) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    carrera VARCHAR(50) NOT NULL,
    id_conv INT(11) NOT NULL,
    titulo VARCHAR(50),
    descripcion TEXT
);

ALTER TABLE reportes_C_A
	ADD PRIMARY KEY (id_repor);
    
ALTER TABLE reportes_C_A
	MODIFY id_repor INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
    
ALTER TABLE reportes_C_A
	ADD FOREIGN KEY (no_control) REFERENCES users_alumnos(no_control);
    
ALTER TABLE reportes_C_A
	ADD FOREIGN KEY (id_conv) REFERENCES convocatorias(id_conv);
    
CREATE TABLE reportes_C_D(
	id_repor INT(11) NOT NULL,
    fecha_rea DATE NOT NULL,
    no_control VARCHAR(25) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    carrera VARCHAR(50) NOT NULL,
    id_conv INT(11) NOT NULL,
    titulo VARCHAR(50),
    descripcion TEXT
);

ALTER TABLE reportes_C_D
	ADD PRIMARY KEY (id_repor);
    
ALTER TABLE reportes_C_D
	MODIFY id_repor INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
    
ALTER TABLE reportes_C_D
	ADD FOREIGN KEY (no_control) REFERENCES users_docentes(no_control);
    
ALTER TABLE reportes_C_D
	ADD FOREIGN KEY (id_conv) REFERENCES convocatorias(id_conv);

CREATE TABLE registros_C_A(
	id_reg INT(11) NOT NULL,
    id_conv INT(11) NOT NULL,
    titulo VARCHAR(50) NOT NULL,
    no_control VARCHAR(25) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    carrera VARCHAR(50) NOT NULL,
    semestre VARCHAR(50) NOT NULL,
    correo_ext VARCHAR(50) NOT NULL,
    archivo VARCHAR(100) NOT NULL
);   

ALTER TABLE registros_C_A
	ADD PRIMARY KEY (id_reg);
    
ALTER TABLE registros_C_A
	MODIFY id_reg INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
    
ALTER TABLE registros_C_A
	ADD FOREIGN KEY (no_control) REFERENCES users_alumnos(no_control);
    
ALTER TABLE registros_C_A
	ADD FOREIGN KEY (id_conv) REFERENCES convocatorias(id_conv); 
    
CREATE TABLE registros_C_D(
	id_reg INT(11) NOT NULL,
    id_conv INT(11) NOT NULL,
    titulo VARCHAR(50) NOT NULL,
    no_control VARCHAR(25) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    carrera VARCHAR(50) NOT NULL,
    semestre VARCHAR(50) NOT NULL,
    correo_ext VARCHAR(50) NOT NULL,
    archivo VARCHAR(100) NOT NULL
);   

ALTER TABLE registros_C_D
	ADD PRIMARY KEY (id_reg);
    
ALTER TABLE registros_C_D
	MODIFY id_reg INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;
    
ALTER TABLE registros_C_D
	ADD FOREIGN KEY (no_control) REFERENCES users_docentes(no_control);
    
ALTER TABLE registros_C_D
	ADD FOREIGN KEY (id_conv) REFERENCES convocatorias(id_conv); 