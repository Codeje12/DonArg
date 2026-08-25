package com.donarg.api.usuario.repository;

import com.donarg.api.usuario.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByNombreUsuario(String nombreUsuario);

    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    Optional<Usuario> findByTokenVerificacion(String tokenVerificacion);
}
