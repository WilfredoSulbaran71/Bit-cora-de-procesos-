CREATE DATABASE Bitacora01;

USE Bitacora01;

CREATE TABLE registros(
id INT AUTO_INCREMENT PRIMARY KEY,
fecha date,
cliente VARCHAR (50) NOT NULL,
solicitante VARCHAR (50) NOT NULL,
descripcion VARCHAR (200) NOT NULL,
estado VARCHAR (50) NOT NULL,
responsable VARCHAR (50) NOT NULL,
observaciones VARCHAR (200) NOT NULL
);

SELECT * FROM registros;