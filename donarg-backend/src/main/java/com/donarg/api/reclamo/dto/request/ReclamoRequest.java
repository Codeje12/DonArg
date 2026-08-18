package com.donarg.api.reclamo.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class ReclamoRequest {

    @NotNull(message = "La publicacion es obligatoria")
    private Long publicacionId;

    @NotNull(message = "El usuario es obligatorio")
    private Long usuarioId;

    @NotBlank(message = "El dato de verificacion es obligatorio")
    @Size(max = 500, message = "El dato de verificacion no puede superar los 500 caracteres")
    private String datoVerificacion;
}
