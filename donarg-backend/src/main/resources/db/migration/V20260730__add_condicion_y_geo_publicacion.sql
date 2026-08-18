ALTER TABLE publicacion
    ADD COLUMN condicion VARCHAR(20)
        CHECK (condicion IN ('NUEVO', 'POCO_USO', 'USADO'));

ALTER TABLE publicacion
    ADD COLUMN latitud  DOUBLE PRECISION,
    ADD COLUMN longitud DOUBLE PRECISION;
