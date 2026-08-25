package com.donarg.api.usuario.service;

import com.donarg.api.usuario.dto.request.UsuarioLoginRequest;
import com.donarg.api.usuario.dto.request.UsuarioRegistroRequest;
import com.donarg.api.usuario.dto.response.UsuarioResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface UsuarioService {

    UsuarioResponse registrar(UsuarioRegistroRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse);

    UsuarioResponse login(UsuarioLoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse);

    void logout(HttpServletRequest httpRequest);

    UsuarioResponse verificar(Long id);

    UsuarioResponse buscarPorId(Long id);

    boolean nombreUsuarioDisponible(String nombreUsuario);

    UsuarioResponse verificarEmail(String token);

    UsuarioResponse reenviarVerificacion(Long id);
}
