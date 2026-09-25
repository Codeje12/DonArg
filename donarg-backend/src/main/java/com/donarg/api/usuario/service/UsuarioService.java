package com.donarg.api.usuario.service;

import com.donarg.api.usuario.dto.request.BajaCuentaRequest;
import com.donarg.api.usuario.dto.request.CambiarEmailRequest;
import com.donarg.api.usuario.dto.request.CambiarPasswordRequest;
import com.donarg.api.usuario.dto.request.UsuarioActualizacionRequest;
import com.donarg.api.usuario.dto.request.UsuarioLoginRequest;
import com.donarg.api.usuario.dto.request.UsuarioRegistroRequest;
import com.donarg.api.usuario.dto.response.UsuarioDniResponse;
import com.donarg.api.usuario.dto.response.UsuarioResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UsuarioService {

    UsuarioResponse registrar(UsuarioRegistroRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse);

    UsuarioResponse login(UsuarioLoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse);

    void logout(HttpServletRequest httpRequest);

    UsuarioResponse verificar(Long id);

    UsuarioResponse buscarPorId(Long id);

    boolean nombreUsuarioDisponible(String nombreUsuario);

    UsuarioResponse verificarEmail(String token);

    UsuarioResponse reenviarVerificacion(Long id);

    UsuarioResponse actualizarDatosPropios(UsuarioActualizacionRequest request);

    void cambiarPassword(CambiarPasswordRequest request);

    UsuarioResponse cambiarEmail(CambiarEmailRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse);

    UsuarioDniResponse obtenerDniPropio();

    UsuarioResponse subirFotoPerfil(MultipartFile archivo);

    void darDeBaja(BajaCuentaRequest request, HttpServletRequest httpRequest);
}
