ALTER TABLE imagen RENAME COLUMN url TO nombre_archivo;
ALTER TABLE imagen ALTER COLUMN nombre_archivo TYPE VARCHAR(150);
