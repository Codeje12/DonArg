package com.donarg.api.mensaje.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MensajeRequest {

    @NotNull(message = "El chat es obligatorio")
    private Long chatId;

    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;
}
