ALTER TABLE usuario ADD COLUMN apellido VARCHAR(120);
ALTER TABLE usuario ADD COLUMN nombre_usuario VARCHAR(50);
ALTER TABLE usuario ADD COLUMN password_hash VARCHAR(100);
ALTER TABLE usuario ADD COLUMN dni VARCHAR(15); -- TODO: cifrar cuando se defina manejo de secretos
ALTER TABLE usuario ADD COLUMN fecha_nacimiento DATE;
ALTER TABLE usuario ADD COLUMN email_verificado BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE usuario ADD COLUMN token_verificacion VARCHAR(100);
ALTER TABLE usuario ADD COLUMN token_verificacion_expira TIMESTAMP;

ALTER TABLE usuario ADD CONSTRAINT uq_usuario_nombre_usuario UNIQUE (nombre_usuario);
