package com.donarg.api.chat.mapper;

import com.donarg.api.chat.dto.response.ChatResponse;
import com.donarg.api.chat.model.Chat;
import org.springframework.stereotype.Component;

@Component
public class ChatMapper {

    public ChatResponse toResponse(Chat chat) {
        ChatResponse response = new ChatResponse();
        response.setId(chat.getId());
        response.setPublicacionId(chat.getPublicacion().getId());
        response.setFechaInicio(chat.getFechaInicio());
        return response;
    }
}
