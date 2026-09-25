package com.donarg.api.usuario.controller;

import com.donarg.api.usuario.dto.request.BajaCuentaRequest;
import com.donarg.api.usuario.dto.request.CambiarEmailRequest;
import com.donarg.api.usuario.dto.request.CambiarPasswordRequest;
import com.donarg.api.usuario.dto.request.UsuarioActualizacionRequest;
import com.donarg.api.usuario.dto.request.UsuarioLoginRequest;
import com.donarg.api.usuario.dto.request.UsuarioRegistroRequest;
import com.donarg.api.usuario.dto.response.UsuarioDniResponse;
import com.donarg.api.usuario.dto.response.UsuarioResponse;
import com.donarg.api.usuario.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody UsuarioRegistroRequest request,
                                                       HttpServletRequest httpRequest,
                                                       HttpServletResponse httpResponse) {
        // tambien abre sesion al registrarse, por eso necesita request/response igual que el login
        UsuarioResponse response = usuarioService.registrar(request, httpRequest, httpResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody UsuarioLoginRequest request,
                                                  HttpServletRequest httpRequest,
                                                  HttpServletResponse httpResponse) {
        // request/response de servlet: hacen falta para dejar la sesion HTTP guardada
        return ResponseEntity.ok(usuarioService.login(request, httpRequest, httpResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        usuarioService.logout(httpRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PatchMapping("/{id}/verificar")
    public ResponseEntity<UsuarioResponse> verificar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.verificar(id));
    }

    @GetMapping("/nombre-usuario-disponible")
    public ResponseEntity<Boolean> nombreUsuarioDisponible(@RequestParam String valor) {
        return ResponseEntity.ok(usuarioService.nombreUsuarioDisponible(valor));
    }

    @GetMapping("/verificar-email")
    public ResponseEntity<UsuarioResponse> verificarEmail(@RequestParam String token) {
        return ResponseEntity.ok(usuarioService.verificarEmail(token));
    }

    @PostMapping("/{id}/reenviar-verificacion")
    public ResponseEntity<UsuarioResponse> reenviarVerificacion(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.reenviarVerificacion(id));
    }

    @PatchMapping("/me")
    public ResponseEntity<UsuarioResponse> actualizarDatosPropios(@Valid @RequestBody UsuarioActualizacionRequest request) {
        return ResponseEntity.ok(usuarioService.actualizarDatosPropios(request));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> cambiarPassword(@Valid @RequestBody CambiarPasswordRequest request) {
        usuarioService.cambiarPassword(request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/me/email")
    public ResponseEntity<UsuarioResponse> cambiarEmail(@Valid @RequestBody CambiarEmailRequest request,
                                                          HttpServletRequest httpRequest,
                                                          HttpServletResponse httpResponse) {
        return ResponseEntity.ok(usuarioService.cambiarEmail(request, httpRequest, httpResponse));
    }

    // GET pero requiere sesion propia -- ver el matcher explicito en SecurityConfig,
    // antes del permitAll general de "GET /api/usuarios/**"
    @GetMapping("/me/dni")
    public ResponseEntity<UsuarioDniResponse> obtenerDniPropio() {
        return ResponseEntity.ok(usuarioService.obtenerDniPropio());
    }

    @PostMapping(value = "/me/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsuarioResponse> subirFotoPerfil(@RequestParam MultipartFile archivo) {
        return ResponseEntity.ok(usuarioService.subirFotoPerfil(archivo));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> darDeBaja(@Valid @RequestBody BajaCuentaRequest request, HttpServletRequest httpRequest) {
        usuarioService.darDeBaja(request, httpRequest);
        return ResponseEntity.noContent().build();
    }
}
