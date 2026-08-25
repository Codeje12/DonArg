package com.donarg.api.chat.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResumenResponse {

    private Long id;
    private Long publicacionId;
    private String publicacionTitulo;
    private Long otroUsuarioId;
    private String otroUsuarioNombre;
    private String ultimoMensaje;
    private LocalDateTime ultimoMensajeFecha;
    private long noLeidos;
}
