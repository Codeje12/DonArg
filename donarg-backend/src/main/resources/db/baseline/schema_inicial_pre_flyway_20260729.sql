-- V1: crea la tabla usuario, según el DER del proyecto.
-- Corresponde al módulo de Usuario que se está armando ahora (RF01, RF02).

CREATE TABLE usuario (
    id                   BIGSERIAL PRIMARY KEY,
    nombre               VARCHAR(120)  NOT NULL,
    email                VARCHAR(160)  NOT NULL UNIQUE,
    telefono             VARCHAR(30),
    verificado           BOOLEAN       NOT NULL DEFAULT FALSE,
    promedio_valoracion  REAL          NOT NULL DEFAULT 0,
    fecha_registro       TIMESTAMP     NOT NULL DEFAULT now()
);

COMMENT ON TABLE usuario IS 'Usuarios de la plataforma DonArg. Verificado = cargó DNI (RF02).';

-- V2: crea el resto de las tablas del sistema DonArg, según el DER del proyecto.

CREATE TABLE categoria (
    id      BIGSERIAL PRIMARY KEY,
    nombre  VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE publicacion (
    id                  BIGSERIAL PRIMARY KEY,
    usuario_id          BIGINT       NOT NULL REFERENCES usuario(id),
    categoria_id        BIGINT       NOT NULL REFERENCES categoria(id),
    usuario_elegido_id  BIGINT       REFERENCES usuario(id),
    tipo_publicacion    VARCHAR(20)  NOT NULL
        CHECK (tipo_publicacion IN ('DONACION', 'PEDIDO', 'ENCONTRADO')),
    titulo              VARCHAR(150) NOT NULL,
    descripcion         TEXT,
    estado              VARCHAR(20)  NOT NULL DEFAULT 'ACTIVA'
        CHECK (estado IN ('ACTIVA', 'RESERVADA', 'COMPLETADA', 'CANCELADA')),
    zona_aprox          VARCHAR(120),
    fecha_publicacion   TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE imagen (
    id              BIGSERIAL PRIMARY KEY,
    publicacion_id  BIGINT       NOT NULL REFERENCES publicacion(id) ON DELETE CASCADE,
    url             VARCHAR(300) NOT NULL
);

CREATE TABLE interes (
    id              BIGSERIAL PRIMARY KEY,
    publicacion_id  BIGINT    NOT NULL REFERENCES publicacion(id) ON DELETE CASCADE,
    usuario_id      BIGINT    NOT NULL REFERENCES usuario(id),
    mensaje         VARCHAR(300),
    fecha           TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (publicacion_id, usuario_id)
);

CREATE TABLE oferta (
    id              BIGSERIAL PRIMARY KEY,
    publicacion_id  BIGINT    NOT NULL REFERENCES publicacion(id) ON DELETE CASCADE,
    usuario_id      BIGINT    NOT NULL REFERENCES usuario(id),
    mensaje         VARCHAR(300),
    fecha           TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (publicacion_id, usuario_id)
);

CREATE TABLE reclamo (
    id                 BIGSERIAL PRIMARY KEY,
    publicacion_id     BIGINT       NOT NULL REFERENCES publicacion(id) ON DELETE CASCADE,
    usuario_id         BIGINT       NOT NULL REFERENCES usuario(id),
    dato_verificacion  VARCHAR(500) NOT NULL,
    estado             VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE'
        CHECK (estado IN ('PENDIENTE', 'ACEPTADO', 'RECHAZADO')),
    fecha              TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE chat (
    id              BIGSERIAL PRIMARY KEY,
    publicacion_id  BIGINT    NOT NULL REFERENCES publicacion(id) ON DELETE CASCADE,
    fecha_inicio    TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (publicacion_id)
);

CREATE TABLE mensaje (
    id          BIGSERIAL PRIMARY KEY,
    chat_id     BIGINT    NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    usuario_id  BIGINT    NOT NULL REFERENCES usuario(id),
    contenido   TEXT      NOT NULL,
    fecha       TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE valoracion (
    id                    BIGSERIAL PRIMARY KEY,
    publicacion_id        BIGINT      NOT NULL REFERENCES publicacion(id) ON DELETE CASCADE,
    usuario_evaluador_id  BIGINT      NOT NULL REFERENCES usuario(id),
    usuario_evaluado_id   BIGINT      NOT NULL REFERENCES usuario(id),
    puntaje               SMALLINT    NOT NULL CHECK (puntaje BETWEEN 1 AND 5),
    comentario             VARCHAR(500)
);

-- Índices útiles para las consultas más frecuentes del feed
CREATE INDEX idx_publicacion_tipo_estado ON publicacion (tipo_publicacion, estado);
CREATE INDEX idx_publicacion_categoria ON publicacion (categoria_id);
