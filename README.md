# DonArg — esqueleto del proyecto

Sistema de donaciones, pedidos y objetos encontrados entre vecinos.
Proyecto personal de práctica: Java 17 + Spring Boot 3 en el backend, React en el frontend.

## Estructura

```
donarg/
├── donarg-backend/     -> API REST (Spring Boot 3, Java 17, Maven)
└── donarg-frontend/    -> Cliente web (React + Vite)
```

Este es solo el esqueleto: paquetes y carpetas creados, sin entidades,
sin controllers, sin pantallas todavía. La idea es ir escalando de a una
pieza por vez, según el orden sugerido más abajo.

## Cómo abrir el backend en IntelliJ

1. `File > Open...` y seleccioná la carpeta `donarg-backend` (la que tiene el `pom.xml`).
2. IntelliJ va a detectar que es un proyecto Maven y va a importar las dependencias solo.
3. Verificá que el SDK del proyecto sea Java 17 (`File > Project Structure > Project`).
4. Antes de correrlo vas a necesitar una base PostgreSQL local llamada `donarg`
   (o cambiar la configuración en `src/main/resources/application.yml`).

## Cómo levantar el frontend

Necesitás Node.js instalado. Desde la carpeta `donarg-frontend`:

```
npm install
npm run dev
```

## Orden sugerido para ir completando el esqueleto

1. Entidades JPA en `model/` y enums en `model/enums/` (según el diagrama de clases).
2. Repositories en `repository/`.
3. Services (interfaz + impl) con la lógica de negocio.
4. DTOs de request/response y mappers.
5. Controllers REST, mapeando cada requisito funcional a un endpoint.
6. Seguridad (`config/`), para diferenciar usuario verificado de no verificado.
7. Pantallas de React consumiendo la API ya probada con Postman.

Los documentos de especificación funcional, el DER y el diagrama de clases
del proyecto son la referencia para completar cada paso.
