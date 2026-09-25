package com.donarg.api.interes.service;

import com.donarg.api.interes.dto.request.InteresRequest;
import com.donarg.api.interes.dto.response.InteresResponse;
import java.util.List;

public interface InteresService {

    InteresResponse marcar(InteresRequest request);

    List<InteresResponse> listarPorPublicacion(Long publicacionId);

    List<InteresResponse> listarMios();

    List<InteresResponse> listarRecibidos();

    void eliminar(Long id);
}
