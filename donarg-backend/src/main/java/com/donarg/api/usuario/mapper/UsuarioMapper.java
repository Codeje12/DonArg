package com.donarg.api.usuario.mapper;

import com.donarg.api.usuario.dto.request.UsuarioRegistroRequest;
import com.donarg.api.usuario.dto.response.UsuarioResponse;
import com.donarg.api.usuario.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UsuarioMapper {

    private final PasswordEncoder passwordEncoder;

    public Usuario toEntity(UsuarioRegistroRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setDni(request.getDni());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setVerificado(false);
        usuario.setEmailVerificado(false);
        usuario.setPromedioValoracion(0f);
        usuario.setActivo(true);
        return usuario;
    }

    public UsuarioResponse toResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setEmail(usuario.getEmail());
        response.setTelefono(usuario.getTelefono());
        response.setNombreUsuario(usuario.getNombreUsuario());
        response.setFechaNacimiento(usuario.getFechaNacimiento());
        response.setVerificado(usuario.isVerificado());
        response.setEmailVerificado(usuario.isEmailVerificado());
        response.setPromedioValoracion(usuario.getPromedioValoracion());
        response.setFotoPerfil(usuario.getFotoPerfil());
        return response;
    }
}
