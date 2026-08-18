package com.donarg.api.interes.mapper;

import com.donarg.api.interes.dto.request.InteresRequest;
import com.donarg.api.interes.dto.response.InteresResponse;
import com.donarg.api.interes.model.Interes;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.usuario.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class InteresMapper {

    public Interes toEntity(InteresRequest request, Publicacion publicacion, Usuario usuario) {
        Interes interes = new Interes();
        interes.setPublicacion(publicacion);
        interes.setUsuario(usuario);
        interes.setMensaje(request.getMensaje());
        return interes;
    }

    public InteresResponse toResponse(Interes interes) {
        InteresResponse response = new InteresResponse();
        response.setId(interes.getId());
        response.setPublicacionId(interes.getPublicacion().getId());
        response.setUsuarioId(interes.getUsuario().getId());
        response.setUsuarioNombre(interes.getUsuario().getNombre());
        response.setMensaje(interes.getMensaje());
        response.setFecha(interes.getFecha());
        return response;
    }
}
