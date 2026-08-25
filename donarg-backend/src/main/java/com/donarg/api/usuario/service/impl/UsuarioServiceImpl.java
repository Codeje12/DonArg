package com.donarg.api.usuario.service.impl;

import com.donarg.api.exception.CredencialesInvalidasException;
import com.donarg.api.exception.OperacionInvalidaException;
import com.donarg.api.exception.RegistroInvalidoException;
import com.donarg.api.exception.ResourceNotFoundException;
import com.donarg.api.usuario.dto.request.UsuarioLoginRequest;
import com.donarg.api.usuario.dto.request.UsuarioRegistroRequest;
import com.donarg.api.usuario.dto.response.UsuarioResponse;
import com.donarg.api.usuario.mapper.UsuarioMapper;
import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.repository.UsuarioRepository;
import com.donarg.api.usuario.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private static final int EDAD_MINIMA = 18;
    private static final String FRONTEND_URL = "http://localhost:5173";
    private static final String MENSAJE_CREDENCIALES_INVALIDAS = "Email/usuario o contrasena incorrectos";

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final AuthenticationManager authenticationManager;

    // se guarda el contexto de seguridad en la sesion HTTP; no hace falta bean, es sin estado propio
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @Override
    public UsuarioResponse registrar(UsuarioRegistroRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        Map<String, String> errores = new HashMap<>();

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            errores.put("email", "Ya existe una cuenta registrada con ese email");
        }
        if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
            errores.put("nombreUsuario", "Usuario no disponible");
        }
        if (Period.between(request.getFechaNacimiento(), java.time.LocalDate.now()).getYears() < EDAD_MINIMA) {
            errores.put("fechaNacimiento", "Tenes que ser mayor de 18 para registrarte");
        }
        if (!errores.isEmpty()) {
            throw new RegistroInvalidoException(errores);
        }

        Usuario usuario = usuarioMapper.toEntity(request);
        generarTokenVerificacion(usuario);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // ya quedo guardado en la base: iniciamos sesion de una con la misma contrasena que mando
        // (asi no hace falta un login aparte despues de registrarse)
        autenticar(request.getEmail(), request.getPassword(), httpRequest, httpResponse);

        return usuarioMapper.toResponse(usuarioGuardado);
    }

    @Override
    public UsuarioResponse login(UsuarioLoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        Authentication autenticacion;
        try {
            autenticacion = autenticar(request.getIdentificador(), request.getPassword(), httpRequest, httpResponse);
        } catch (AuthenticationException ex) {
            throw new CredencialesInvalidasException(MENSAJE_CREDENCIALES_INVALIDAS);
        }

        // el username del UserDetails siempre es el email (asi lo armamos en UsuarioDetailsService)
        Usuario usuario = usuarioRepository.findByEmail(autenticacion.getName())
                .orElseThrow(() -> new CredencialesInvalidasException(MENSAJE_CREDENCIALES_INVALIDAS));

        return usuarioMapper.toResponse(usuario);
    }

    // usado por login() y registrar(): valida usuario+contrasena contra Spring Security
    // (UsuarioDetailsService + PasswordEncoder por detras del AuthenticationManager) y deja
    // la sesion armada y guardada, lista para el resto de los pedidos de este navegador
    private Authentication autenticar(String identificador, String password, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {

        Authentication autenticacion = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identificador, password));

        SecurityContext contexto = SecurityContextHolder.createEmptyContext();
        contexto.setAuthentication(autenticacion);
        SecurityContextHolder.setContext(contexto);

        // se persiste en la sesion HTTP; sin esto, en el proximo pedido ya no estariamos logueados
        securityContextRepository.saveContext(contexto, httpRequest, httpResponse);

        return autenticacion;
    }

    @Override
    public void logout(HttpServletRequest httpRequest) {
        // getSession(false): si no hay sesion, no crea una nueva de la nada
        HttpSession sesion = httpRequest.getSession(false);
        if (sesion != null) {
            // borra todo lo guardado en la sesion (incluido el SecurityContext) y la cookie deja de servir
            sesion.invalidate();
        }
        // limpia tambien el contexto de este mismo pedido, por las dudas
        SecurityContextHolder.clearContext();
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

    @Override
    public boolean nombreUsuarioDisponible(String nombreUsuario) {
        return !usuarioRepository.existsByNombreUsuario(nombreUsuario);
    }

    @Override
    public UsuarioResponse verificarEmail(String token) {
        Usuario usuario = usuarioRepository.findByTokenVerificacion(token)
                .orElseThrow(() -> new ResourceNotFoundException("El link de verificacion no es valido"));

        if (usuario.getTokenVerificacionExpira() == null
                || usuario.getTokenVerificacionExpira().isBefore(LocalDateTime.now())) {
            throw new OperacionInvalidaException("El link de verificacion vencio, pedi que te reenvien uno nuevo");
        }

        usuario.setEmailVerificado(true);
        usuario.setTokenVerificacion(null);
        usuario.setTokenVerificacionExpira(null);
        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioResponse reenviarVerificacion(Long id) {
        Usuario usuario = buscarUsuarioOFallar(id);
        generarTokenVerificacion(usuario);
        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    private void generarTokenVerificacion(Usuario usuario) {
        String token = UUID.randomUUID().toString();
        usuario.setTokenVerificacion(token);
        usuario.setTokenVerificacionExpira(LocalDateTime.now().plusHours(24));
        log.info("Link de verificacion para {}: {}/verificar-email?token={}", usuario.getEmail(), FRONTEND_URL, token);
    }

    private Usuario buscarUsuarioOFallar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontro el usuario con id " + id));
    }
}
