package com.donarg.api.interes.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InteresResponse {

    private Long id;
    private Long publicacionId;
    private Long usuarioId;
    private String usuarioNombre;
    private String mensaje;
    private LocalDateTime fecha;
}
