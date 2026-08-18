package com.donarg.api.reclamo.dto.response;

import com.donarg.api.reclamo.model.EstadoReclamo;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReclamoResponse {

    private Long id;
    private Long publicacionId;
    private Long usuarioId;
    private String usuarioNombre;
    private String datoVerificacion;
    private EstadoReclamo estado;
    private LocalDateTime fecha;
}
