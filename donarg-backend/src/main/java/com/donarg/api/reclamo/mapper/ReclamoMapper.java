package com.donarg.api.reclamo.mapper;

import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.reclamo.dto.request.ReclamoRequest;
import com.donarg.api.reclamo.dto.response.ReclamoResponse;
import com.donarg.api.reclamo.model.EstadoReclamo;
import com.donarg.api.reclamo.model.Reclamo;
import com.donarg.api.usuario.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class ReclamoMapper {

    public Reclamo toEntity(ReclamoRequest request, Publicacion publicacion, Usuario usuario) {
        Reclamo reclamo = new Reclamo();
        reclamo.setPublicacion(publicacion);
        reclamo.setUsuario(usuario);
        reclamo.setDatoVerificacion(request.getDatoVerificacion());
        reclamo.setEstado(EstadoReclamo.PENDIENTE);
        return reclamo;
    }

    public ReclamoResponse toResponse(Reclamo reclamo) {
        ReclamoResponse response = new ReclamoResponse();
        response.setId(reclamo.getId());
        response.setPublicacionId(reclamo.getPublicacion().getId());
        response.setUsuarioId(reclamo.getUsuario().getId());
        response.setUsuarioNombre(reclamo.getUsuario().getNombre());
        response.setDatoVerificacion(reclamo.getDatoVerificacion());
        response.setEstado(reclamo.getEstado());
        response.setFecha(reclamo.getFecha());
        return response;
    }
}
