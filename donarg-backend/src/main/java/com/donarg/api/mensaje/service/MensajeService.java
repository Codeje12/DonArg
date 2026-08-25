package com.donarg.api.mensaje.service;

import com.donarg.api.mensaje.dto.request.MensajeRequest;
import com.donarg.api.mensaje.dto.response.MensajeResponse;
import java.util.List;

public interface MensajeService {

    MensajeResponse enviar(MensajeRequest request);

    List<MensajeResponse> listarPorChat(Long chatId);

    long contarNoLeidos(Long chatId);

    void marcarLeidos(Long chatId);
}
