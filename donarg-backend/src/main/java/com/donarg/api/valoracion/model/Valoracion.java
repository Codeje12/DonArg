package com.donarg.api.valoracion.model;

import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.usuario.model.Usuario;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "valoracion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Valoracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publicacion_id", nullable = false)
    private Publicacion publicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_evaluador_id", nullable = false)
    private Usuario usuarioEvaluador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_evaluado_id", nullable = false)
    private Usuario usuarioEvaluado;

    @Column(nullable = false)
    private Short puntaje;

    @Column(length = 500)
    private String comentario;
}
