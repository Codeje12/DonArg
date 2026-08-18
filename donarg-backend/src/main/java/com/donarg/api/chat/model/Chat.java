package com.donarg.api.chat.model;

import com.donarg.api.publicacion.model.Publicacion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

@Entity
@Table(name = "chat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publicacion_id", nullable = false, unique = true)
    private Publicacion publicacion;

    // la completa Postgres con DEFAULT now() al insertar (ver DDL), nunca se setea desde Java
    @Generated(event = EventType.INSERT)
    @Column(name = "fecha_inicio", nullable = false, insertable = false, updatable = false)
    private LocalDateTime fechaInicio;
}
