package com.donarg.api.chat.service;

import com.donarg.api.chat.dto.response.ChatResponse;
import com.donarg.api.chat.dto.response.ChatResumenResponse;
import java.util.List;

public interface ChatService {

    // Idempotente: pensado para ser invocado desde Publicacion/Reclamo al pasar a RESERVADA, no expuesto como endpoint propio.
    void crearParaPublicacion(Long publicacionId);

    ChatResponse buscarPorId(Long id);

    ChatResponse buscarPorPublicacionId(Long publicacionId);

    List<ChatResumenResponse> listarPorUsuario();
}
