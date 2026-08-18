package com.donarg.api.mensaje.service.impl;

import com.donarg.api.chat.model.Chat;
import com.donarg.api.chat.repository.ChatRepository;
import com.donarg.api.exception.OperacionInvalidaException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.mensaje.dto.request.MensajeRequest;
import com.donarg.api.mensaje.dto.response.MensajeResponse;
import com.donarg.api.mensaje.mapper.MensajeMapper;
import com.donarg.api.mensaje.model.Mensaje;
import com.donarg.api.mensaje.repository.MensajeRepository;
import com.donarg.api.mensaje.service.MensajeService;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.repository.UsuarioRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MensajeServiceImpl implements MensajeService {

    private final MensajeRepository mensajeRepository;
    private final ChatRepository chatRepository;
    private final UsuarioRepository usuarioRepository;
    private final MensajeMapper mensajeMapper;

    @Override
    public MensajeResponse enviar(MensajeRequest request) {
        Chat chat = chatRepository.findById(request.getChatId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el chat con id " + request.getChatId()));

        Publicacion publicacion = chat.getPublicacion();
        boolean esDueño = request.getUsuarioId().equals(publicacion.getUsuario().getId());
        boolean esElegido = publicacion.getUsuarioElegido() != null
                && request.getUsuarioId().equals(publicacion.getUsuarioElegido().getId());

        if (!esDueño && !esElegido) {
            throw new OperacionInvalidaException("Solo los participantes del chat pueden enviar mensajes");
        }

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el usuario con id " + request.getUsuarioId()));

        Mensaje mensaje = mensajeMapper.toEntity(request, chat, usuario);
        Mensaje mensajeGuardado = mensajeRepository.save(mensaje);
        return mensajeMapper.toResponse(mensajeGuardado);
    }

    @Override
    public List<MensajeResponse> listarPorChat(Long chatId) {
        return mensajeRepository.findByChatIdOrderByFechaAsc(chatId).stream()
                .map(mensajeMapper::toResponse)
                .toList();
    }
}
