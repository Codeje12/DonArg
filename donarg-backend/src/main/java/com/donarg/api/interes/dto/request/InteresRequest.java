package com.donarg.api.interes.dto.request;

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
public class InteresRequest {

    @NotNull(message = "La publicacion es obligatoria")
    private Long publicacionId;

    @Size(max = 300, message = "El mensaje no puede superar los 300 caracteres")
    private String mensaje;
}
