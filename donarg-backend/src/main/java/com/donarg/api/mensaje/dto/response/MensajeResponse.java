package com.donarg.api.mensaje.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MensajeResponse {

    private Long id;
    private Long chatId;
    private Long usuarioId;
    private String usuarioNombre;
    private String contenido;
    private boolean leido;
    private LocalDateTime fecha;
}
