package com.donarg.api.imagen.service;

import com.donarg.api.imagen.dto.response.ImagenResponse;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ImagenService {

    ImagenResponse agregar(Long publicacionId, MultipartFile archivo);

    List<ImagenResponse> listarPorPublicacion(Long publicacionId);

    void eliminar(Long id);
}
