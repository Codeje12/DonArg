package com.donarg.api.oferta.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfertaResponse {

    private Long id;
    private Long publicacionId;
    private Long usuarioId;
    private String usuarioNombre;
    private String mensaje;
    private LocalDateTime fecha;
}
