package com.donarg.api.publicacion.service;

import com.donarg.api.publicacion.dto.request.ElegirInteresadoRequest;
import com.donarg.api.publicacion.dto.request.PublicacionActualizacionRequest;
import com.donarg.api.publicacion.dto.request.PublicacionRequest;
import com.donarg.api.publicacion.dto.response.PublicacionResponse;
import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PublicacionService {

    PublicacionResponse crear(PublicacionRequest request);

    Page<PublicacionResponse> listar(TipoPublicacion tipo, EstadoPublicacion estado, EstadoPublicacion estadoExcluido,
                                      Long categoriaId, Long usuarioId, Long usuarioIdExcluido, Pageable pageable);

    PublicacionResponse buscarPorId(Long id);

    PublicacionResponse actualizar(Long id, PublicacionActualizacionRequest request);

    PublicacionResponse elegirInteresado(Long id, ElegirInteresadoRequest request);

    PublicacionResponse cerrar(Long id);

    PublicacionResponse cancelar(Long id);
}
