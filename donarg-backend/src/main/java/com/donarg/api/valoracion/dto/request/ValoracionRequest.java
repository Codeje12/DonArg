package com.donarg.api.valoracion.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ValoracionRequest {

    @NotNull(message = "La publicacion es obligatoria")
    private Long publicacionId;

    @NotNull(message = "El usuario evaluador es obligatorio")
    private Long usuarioEvaluadorId;

    @NotNull(message = "El puntaje es obligatorio")
    @Min(value = 1, message = "El puntaje minimo es 1")
    @Max(value = 5, message = "El puntaje maximo es 5")
    private Short puntaje;

    @Size(max = 500, message = "El comentario no puede superar los 500 caracteres")
    private String comentario;
}
