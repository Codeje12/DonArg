package com.donarg.api.usuario.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(length = 120)
    private String apellido;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(length = 30)
    private String telefono;

    @Column(name = "nombre_usuario", length = 50)
    private String nombreUsuario;

    @Column(name = "password_hash", length = 100)
    private String passwordHash;

    // TODO: cifrar cuando se defina manejo de secretos
    @Column(length = 15)
    private String dni;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(nullable = false)
    private boolean verificado;

    @Column(name = "email_verificado", nullable = false)
    private boolean emailVerificado;

    @Column(name = "token_verificacion", length = 100)
    private String tokenVerificacion;

    @Column(name = "token_verificacion_expira")
    private LocalDateTime tokenVerificacionExpira;

    @Column(name = "promedio_valoracion", nullable = false)
    private float promedioValoracion;

    // la completa Postgres con DEFAULT now() al insertar (ver DDL), nunca se setea desde Java
    @Generated(event = EventType.INSERT)
    @Column(name = "fecha_registro", nullable = false, insertable = false, updatable = false)
    private LocalDateTime fechaRegistro;
}
