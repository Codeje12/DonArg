package com.donarg.api.imagen.mapper;

import com.donarg.api.imagen.dto.response.ImagenResponse;
import com.donarg.api.imagen.model.Imagen;
import com.donarg.api.publicacion.model.Publicacion;
import org.springframework.stereotype.Component;

@Component
public class ImagenMapper {

    public Imagen toEntity(String nombreArchivo, Publicacion publicacion) {
        Imagen imagen = new Imagen();
        imagen.setPublicacion(publicacion);
        imagen.setNombreArchivo(nombreArchivo);
        return imagen;
    }

    public ImagenResponse toResponse(Imagen imagen) {
        ImagenResponse response = new ImagenResponse();
        response.setId(imagen.getId());
        response.setPublicacionId(imagen.getPublicacion().getId());
        response.setNombreArchivo(imagen.getNombreArchivo());
        return response;
    }
}
