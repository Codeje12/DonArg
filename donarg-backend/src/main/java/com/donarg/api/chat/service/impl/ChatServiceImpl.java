package com.donarg.api.chat.service.impl;

import com.donarg.api.chat.dto.response.ChatResponse;
import com.donarg.api.chat.mapper.ChatMapper;
import com.donarg.api.chat.model.Chat;
import com.donarg.api.chat.repository.ChatRepository;
import com.donarg.api.chat.service.ChatService;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.repository.PublicacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final PublicacionRepository publicacionRepository;
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
        return chatMapper.toResponse(chatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el chat con id " + id)));
    }

    @Override
    public ChatResponse buscarPorPublicacionId(Long publicacionId) {
        return chatMapper.toResponse(chatRepository.findByPublicacionId(publicacionId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro un chat para la publicacion con id " + publicacionId)));
    }
}
