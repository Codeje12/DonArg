package com.donarg.api.valoracion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ValoracionResponse {

    private Long id;
    private Long publicacionId;
    private Long usuarioEvaluadorId;
    private String usuarioEvaluadorNombre;
    private Long usuarioEvaluadoId;
    private String usuarioEvaluadoNombre;
    private Short puntaje;
    private String comentario;
}
