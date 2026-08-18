package com.donarg.api.valoracion.mapper;

import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.valoracion.dto.request.ValoracionRequest;
import com.donarg.api.valoracion.dto.response.ValoracionResponse;
import com.donarg.api.valoracion.model.Valoracion;
import org.springframework.stereotype.Component;

@Component
public class ValoracionMapper {

    public Valoracion toEntity(ValoracionRequest request, Publicacion publicacion, Usuario evaluador, Usuario evaluado) {
        Valoracion valoracion = new Valoracion();
        valoracion.setPublicacion(publicacion);
        valoracion.setUsuarioEvaluador(evaluador);
        valoracion.setUsuarioEvaluado(evaluado);
        valoracion.setPuntaje(request.getPuntaje());
        valoracion.setComentario(request.getComentario());
        return valoracion;
    }

    public ValoracionResponse toResponse(Valoracion valoracion) {
        ValoracionResponse response = new ValoracionResponse();
        response.setId(valoracion.getId());
        response.setPublicacionId(valoracion.getPublicacion().getId());
        response.setUsuarioEvaluadorId(valoracion.getUsuarioEvaluador().getId());
        response.setUsuarioEvaluadorNombre(valoracion.getUsuarioEvaluador().getNombre());
        response.setUsuarioEvaluadoId(valoracion.getUsuarioEvaluado().getId());
        response.setUsuarioEvaluadoNombre(valoracion.getUsuarioEvaluado().getNombre());
        response.setPuntaje(valoracion.getPuntaje());
        response.setComentario(valoracion.getComentario());
        return response;
    }
}
