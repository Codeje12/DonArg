package com.donarg.api.usuario.service.impl;

import com.donarg.api.exception.EmailDuplicadoException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.usuario.dto.request.UsuarioRegistroRequest;
import com.donarg.api.usuario.dto.response.UsuarioResponse;
import com.donarg.api.usuario.mapper.UsuarioMapper;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.repository.UsuarioRepository;
import com.donarg.api.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public UsuarioResponse registrar(UsuarioRegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EmailDuplicadoException("Ya existe una cuenta registrada con ese email");
        }

        Usuario usuario = usuarioMapper.toEntity(request);
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(usuarioGuardado);
    }

    @Override
    public UsuarioResponse verificar(Long id) {
        Usuario usuario = buscarUsuarioOFallar(id);
        usuario.setVerificado(true);
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(usuarioActualizado);
    }

    @Override
    public UsuarioResponse buscarPorId(Long id) {
        return usuarioMapper.toResponse(buscarUsuarioOFallar(id));
    }

    private Usuario buscarUsuarioOFallar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el usuario con id " + id));
    }
}
