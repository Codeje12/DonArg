package com.donarg.api.chat.service.impl;

import com.donarg.api.chat.dto.response.ChatResponse;
import com.donarg.api.chat.dto.response.ChatResumenResponse;
import com.donarg.api.chat.mapper.ChatMapper;
import com.donarg.api.chat.model.Chat;
import com.donarg.api.chat.repository.ChatRepository;
import com.donarg.api.chat.service.ChatService;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.mensaje.repository.MensajeRepository;
import com.donarg.api.exception.OperacionInvalidaException;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.repository.PublicacionRepository;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.security.UsuarioActualProvider;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final PublicacionRepository publicacionRepository;
    private final MensajeRepository mensajeRepository;
    private final UsuarioActualProvider usuarioActualProvider;
    private final ChatMapper chatMapper;

    @Override
    public void crearParaPublicacion(Long publicacionId) {
        if (chatRepository.existsByPublicacionId(publicacionId)) {
            return;
        }

        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro la publicacion con id " + publicacionId));

        Chat chat = new Chat();
        chat.setPublicacion(publicacion);
        chatRepository.save(chat);
    }

    @Override
    public ChatResponse buscarPorId(Long id) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el chat con id " + id));
        validarParticipante(chat);
        return chatMapper.toResponse(chat);
    }

    @Override
    public ChatResponse buscarPorPublicacionId(Long publicacionId) {
        Chat chat = chatRepository.findByPublicacionId(publicacionId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro un chat para la publicacion con id " + publicacionId));
        validarParticipante(chat);
        return chatMapper.toResponse(chat);
    }

    @Override
    public List<ChatResumenResponse> listarPorUsuario() {
        Long usuarioId = usuarioActualProvider.obtenerId();
        return chatRepository.findByUsuarioParticipante(usuarioId).stream()
                .map(chat -> construirResumen(chat, usuarioId))
                .sorted(Comparator.comparing(
                        ChatResumenResponse::getUltimoMensajeFecha,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    private void validarParticipante(Chat chat) {
        Long usuarioId = usuarioActualProvider.obtenerId();
        Publicacion publicacion = chat.getPublicacion();
        boolean esDueño = publicacion.getUsuario().getId().equals(usuarioId);
        boolean esElegido = publicacion.getUsuarioElegido() != null
                && publicacion.getUsuarioElegido().getId().equals(usuarioId);
        if (!esDueño && !esElegido) {
            throw new OperacionInvalidaException("Solo los participantes del chat pueden verlo");
        }
    }

    private ChatResumenResponse construirResumen(Chat chat, Long usuarioId) {
        Publicacion publicacion = chat.getPublicacion();
        boolean esDueño = publicacion.getUsuario().getId().equals(usuarioId);
        Usuario otro = esDueño ? publicacion.getUsuarioElegido() : publicacion.getUsuario();

        ChatResumenResponse response = new ChatResumenResponse();
        response.setId(chat.getId());
        response.setPublicacionId(publicacion.getId());
        response.setPublicacionTitulo(publicacion.getTitulo());
        response.setOtroUsuarioId(otro.getId());
        response.setOtroUsuarioNombre(otro.getNombre());

        mensajeRepository.findTopByChatIdOrderByFechaDesc(chat.getId()).ifPresent(ultimo -> {
            response.setUltimoMensaje(ultimo.getContenido());
            response.setUltimoMensajeFecha(ultimo.getFecha());
        });

        response.setNoLeidos(mensajeRepository.countByChatIdAndUsuarioIdNotAndLeidoFalse(chat.getId(), usuarioId));

        return response;
    }
}
