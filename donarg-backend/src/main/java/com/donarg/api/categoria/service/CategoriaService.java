package com.donarg.api.categoria.service;

import com.donarg.api.categoria.dto.request.CategoriaRequest;
import com.donarg.api.categoria.dto.response.CategoriaResponse;
import java.util.List;

public interface CategoriaService {

    CategoriaResponse crear(CategoriaRequest request);

    List<CategoriaResponse> listar();

    CategoriaResponse buscarPorId(Long id);

    CategoriaResponse actualizar(Long id, CategoriaRequest request);

    void eliminar(Long id);
}
