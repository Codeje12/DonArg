package com.donarg.api.usuario.security;

import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UsuarioActualProvider {

    private final UsuarioRepository usuarioRepository;

    public Usuario obtener() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el usuario autenticado"));
    }

    public Long obtenerId() {
        return obtener().getId();
    }
}
