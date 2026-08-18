package com.donarg.api.publicacion.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ElegirInteresadoRequest {

    @NotNull(message = "El usuario elegido es obligatorio")
    private Long usuarioElegidoId;
}
