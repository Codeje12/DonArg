package com.donarg.api.chat.service;

import com.donarg.api.chat.dto.response.ChatResponse;

public interface ChatService {

    // Idempotente: pensado para ser invocado desde Publicacion/Reclamo al pasar a RESERVADA, no expuesto como endpoint propio.
    void crearParaPublicacion(Long publicacionId);

    ChatResponse buscarPorId(Long id);

    ChatResponse buscarPorPublicacionId(Long publicacionId);
}
