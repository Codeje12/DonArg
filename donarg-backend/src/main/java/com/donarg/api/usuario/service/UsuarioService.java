package com.donarg.api.usuario.service;

import com.donarg.api.usuario.dto.request.UsuarioRegistroRequest;
import com.donarg.api.usuario.dto.response.UsuarioResponse;

public interface UsuarioService {

    UsuarioResponse registrar(UsuarioRegistroRequest request);

    UsuarioResponse verificar(Long id);

    UsuarioResponse buscarPorId(Long id);
}
