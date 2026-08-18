package com.donarg.api.oferta.service;

import com.donarg.api.oferta.dto.request.OfertaRequest;
import com.donarg.api.oferta.dto.response.OfertaResponse;
import java.util.List;

public interface OfertaService {

    OfertaResponse ofrecer(OfertaRequest request);

    List<OfertaResponse> listarPorPublicacion(Long publicacionId);

    void eliminar(Long id);
}
