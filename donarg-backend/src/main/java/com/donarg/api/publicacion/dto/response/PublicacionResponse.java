package com.donarg.api.publicacion.dto.response;

import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicacionResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private Long categoriaId;
    private String categoriaNombre;
    private Long usuarioElegidoId;
    private String usuarioElegidoNombre;
    private TipoPublicacion tipoPublicacion;
    private String titulo;
    private String descripcion;
    private EstadoPublicacion estado;
    private String zonaAprox;
    private String condicion;
    private Double latitud;
    private Double longitud;
    private LocalDateTime fechaPublicacion;
}
