package com.donarg.api.publicacion.mapper;

import com.donarg.api.categoria.model.Categoria;
import com.donarg.api.publicacion.dto.request.PublicacionRequest;
import com.donarg.api.publicacion.dto.response.PublicacionResponse;
import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.usuario.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class PublicacionMapper {

    public Publicacion toEntity(PublicacionRequest request, Usuario usuario, Categoria categoria) {
        Publicacion publicacion = new Publicacion();
        publicacion.setUsuario(usuario);
        publicacion.setCategoria(categoria);
        publicacion.setTipoPublicacion(request.getTipoPublicacion());
        publicacion.setTitulo(request.getTitulo());
        publicacion.setDescripcion(request.getDescripcion());
        publicacion.setZonaAprox(request.getZonaAprox());
        publicacion.setCondicion(request.getCondicion());
        publicacion.setLatitud(request.getLatitud());
        publicacion.setLongitud(request.getLongitud());
        publicacion.setEstado(EstadoPublicacion.ACTIVA);
        return publicacion;
    }

    public PublicacionResponse toResponse(Publicacion publicacion) {
        PublicacionResponse response = new PublicacionResponse();
        response.setId(publicacion.getId());
        response.setUsuarioId(publicacion.getUsuario().getId());
        response.setUsuarioNombre(publicacion.getUsuario().getNombre());
        response.setCategoriaId(publicacion.getCategoria().getId());
        response.setCategoriaNombre(publicacion.getCategoria().getNombre());
        if (publicacion.getUsuarioElegido() != null) {
            response.setUsuarioElegidoId(publicacion.getUsuarioElegido().getId());
            response.setUsuarioElegidoNombre(publicacion.getUsuarioElegido().getNombre());
        }
        response.setTipoPublicacion(publicacion.getTipoPublicacion());
        response.setTitulo(publicacion.getTitulo());
        response.setDescripcion(publicacion.getDescripcion());
        response.setEstado(publicacion.getEstado());
        response.setZonaAprox(publicacion.getZonaAprox());
        if (publicacion.getCondicion() != null) {
            response.setCondicion(publicacion.getCondicion().getEtiqueta());
        }
        response.setLatitud(publicacion.getLatitud());
        response.setLongitud(publicacion.getLongitud());
        response.setFechaPublicacion(publicacion.getFechaPublicacion());
        return response;
    }
}
