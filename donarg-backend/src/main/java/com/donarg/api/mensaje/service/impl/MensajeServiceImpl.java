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
import com.donarg.api.usuario.security.UsuarioActualProvider;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MensajeServiceImpl implements MensajeService {

    private final MensajeRepository mensajeRepository;
    private final ChatRepository chatRepository;
    private final UsuarioActualProvider usuarioActualProvider;
    private final MensajeMapper mensajeMapper;

    @Override
    public MensajeResponse enviar(MensajeRequest request) {
        Chat chat = chatRepository.findById(request.getChatId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el chat con id " + request.getChatId()));

        Usuario usuario = usuarioActualProvider.obtener();

        if (!esParticipante(chat, usuario.getId())) {
            throw new OperacionInvalidaException("Solo los participantes del chat pueden enviar mensajes");
        }

        Mensaje mensaje = mensajeMapper.toEntity(request, chat, usuario);
        Mensaje mensajeGuardado = mensajeRepository.save(mensaje);
        return mensajeMapper.toResponse(mensajeGuardado);
    }

    @Override
    public List<MensajeResponse> listarPorChat(Long chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el chat con id " + chatId));

        if (!esParticipante(chat, usuarioActualProvider.obtenerId())) {
            throw new OperacionInvalidaException("Solo los participantes del chat pueden ver sus mensajes");
        }

        return mensajeRepository.findByChatIdOrderByFechaAsc(chatId).stream()
                .map(mensajeMapper::toResponse)
                .toList();
    }

    @Override
    public long contarNoLeidos(Long chatId) {
        Long usuarioId = usuarioActualProvider.obtenerId();
        validarParticipante(chatId, usuarioId);
        return mensajeRepository.countByChatIdAndUsuarioIdNotAndLeidoFalse(chatId, usuarioId);
    }

    @Override
    @Transactional
    public void marcarLeidos(Long chatId) {
        Long usuarioId = usuarioActualProvider.obtenerId();
        validarParticipante(chatId, usuarioId);
        mensajeRepository.marcarLeidos(chatId, usuarioId);
    }

    private void validarParticipante(Long chatId, Long usuarioId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el chat con id " + chatId));

        if (!esParticipante(chat, usuarioId)) {
            throw new OperacionInvalidaException("Solo los participantes del chat pueden hacer esto");
        }
    }

    private boolean esParticipante(Chat chat, Long usuarioId) {
        Publicacion publicacion = chat.getPublicacion();
        boolean esDueño = usuarioId.equals(publicacion.getUsuario().getId());
        boolean esElegido = publicacion.getUsuarioElegido() != null
                && usuarioId.equals(publicacion.getUsuarioElegido().getId());
        return esDueño || esElegido;
    }
}
