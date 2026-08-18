package com.donarg.api.reclamo.service;

import com.donarg.api.reclamo.dto.request.ReclamoRequest;
import com.donarg.api.reclamo.dto.response.ReclamoResponse;
import java.util.List;

public interface ReclamoService {

    ReclamoResponse crear(ReclamoRequest request);

    List<ReclamoResponse> listarPorPublicacion(Long publicacionId);

    ReclamoResponse aceptar(Long id);

    ReclamoResponse rechazar(Long id);
}
