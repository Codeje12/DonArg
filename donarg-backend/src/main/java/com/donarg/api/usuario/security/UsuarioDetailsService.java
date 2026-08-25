package com.donarg.api.usuario.security;

import com.donarg.api.usuario.model.Usuario;
import com.donarg.api.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioDetailsService implements UserDetailsService, UserDetailsPasswordService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(username)
                .or(() -> usuarioRepository.findByNombreUsuario(username))
                .orElseThrow(() -> new UsernameNotFoundException("No se encontró un usuario con usuario/mail"));

        if (usuario.getPasswordHash() == null) {
            throw new UsernameNotFoundException("Ese usuario todavia no tiene contrasena configurada");
        }

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPasswordHash())
                .authorities(AuthorityUtils.NO_AUTHORITIES)
                .build();
    }

    // Spring Security llama esto solo, despues de un login exitoso, cuando el PasswordEncoder
    // (PasswordEncoderLegacy) avisa que el hash guardado hay que actualizarlo. "newPassword"
    // ya viene re-encodeado en BCrypt real por el DaoAuthenticationProvider, aca solo se guarda.
    @Override
    public UserDetails updatePassword(UserDetails user, String newPassword) {
        Usuario usuario = usuarioRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("No se encontro el usuario con ese email"));

        usuario.setPasswordHash(newPassword);
        usuarioRepository.save(usuario);

        return loadUserByUsername(user.getUsername());
    }
}
