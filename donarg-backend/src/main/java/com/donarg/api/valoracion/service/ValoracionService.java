package com.donarg.api.valoracion.service;

import com.donarg.api.valoracion.dto.request.ValoracionRequest;
import com.donarg.api.valoracion.dto.response.ValoracionResponse;
import java.util.List;

public interface ValoracionService {

    ValoracionResponse crear(ValoracionRequest request);

    List<ValoracionResponse> listarPorPublicacion(Long publicacionId);

    List<ValoracionResponse> listarPorUsuarioEvaluado(Long usuarioId);
}
