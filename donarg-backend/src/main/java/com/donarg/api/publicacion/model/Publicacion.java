package com.donarg.api.publicacion.model;

import com.donarg.api.categoria.model.Categoria;
import com.donarg.api.usuario.model.Usuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

@Entity
@Table(name = "publicacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_elegido_id")
    private Usuario usuarioElegido;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_publicacion", nullable = false, length = 20)
    private TipoPublicacion tipoPublicacion;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoPublicacion estado;

    @Column(name = "zona_aprox", length = 120)
    private String zonaAprox;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Condicion condicion;

    private Double latitud;

    private Double longitud;

    // la completa Postgres con DEFAULT now() al insertar, nunca se setea desde Java
    @Generated(event = EventType.INSERT)
    @Column(name = "fecha_publicacion", nullable = false, insertable = false, updatable = false)
    private LocalDateTime fechaPublicacion;
}
