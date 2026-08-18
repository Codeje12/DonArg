package com.donarg.api.mensaje.mapper;

import com.donarg.api.chat.model.Chat;
import com.donarg.api.mensaje.dto.request.MensajeRequest;
import com.donarg.api.mensaje.dto.response.MensajeResponse;
import com.donarg.api.mensaje.model.Mensaje;
import com.donarg.api.usuario.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class MensajeMapper {

    public Mensaje toEntity(MensajeRequest request, Chat chat, Usuario usuario) {
        Mensaje mensaje = new Mensaje();
        mensaje.setChat(chat);
        mensaje.setUsuario(usuario);
        mensaje.setContenido(request.getContenido());
        return mensaje;
    }

    public MensajeResponse toResponse(Mensaje mensaje) {
        MensajeResponse response = new MensajeResponse();
        response.setId(mensaje.getId());
        response.setChatId(mensaje.getChat().getId());
        response.setUsuarioId(mensaje.getUsuario().getId());
        response.setUsuarioNombre(mensaje.getUsuario().getNombre());
        response.setContenido(mensaje.getContenido());
        response.setFecha(mensaje.getFecha());
        return response;
    }
}
