package com.donarg.api.categoria.mapper;

import com.donarg.api.categoria.dto.request.CategoriaRequest;
import com.donarg.api.categoria.dto.response.CategoriaResponse;
import com.donarg.api.categoria.model.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public Categoria toEntity(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        return categoria;
    }

    public CategoriaResponse toResponse(Categoria categoria) {
        CategoriaResponse response = new CategoriaResponse();
        response.setId(categoria.getId());
        response.setNombre(categoria.getNombre());
        return response;
    }
}
