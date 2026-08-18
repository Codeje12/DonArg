package com.donarg.api.oferta.mapper;

import com.donarg.api.oferta.dto.request.OfertaRequest;
import com.donarg.api.oferta.dto.response.OfertaResponse;
import com.donarg.api.oferta.model.Oferta;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.usuario.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class OfertaMapper {

    public Oferta toEntity(OfertaRequest request, Publicacion publicacion, Usuario usuario) {
        Oferta oferta = new Oferta();
        oferta.setPublicacion(publicacion);
        oferta.setUsuario(usuario);
        oferta.setMensaje(request.getMensaje());
        return oferta;
    }

    public OfertaResponse toResponse(Oferta oferta) {
        OfertaResponse response = new OfertaResponse();
        response.setId(oferta.getId());
        response.setPublicacionId(oferta.getPublicacion().getId());
        response.setUsuarioId(oferta.getUsuario().getId());
        response.setUsuarioNombre(oferta.getUsuario().getNombre());
        response.setMensaje(oferta.getMensaje());
        response.setFecha(oferta.getFecha());
        return response;
    }
}
