package com.donarg.api.chat.repository;

import com.donarg.api.chat.model.Chat;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByPublicacionId(Long publicacionId);

    boolean existsByPublicacionId(Long publicacionId);

    @Query("SELECT c FROM Chat c WHERE c.publicacion.usuario.id = :usuarioId OR c.publicacion.usuarioElegido.id = :usuarioId")
    List<Chat> findByUsuarioParticipante(@Param("usuarioId") Long usuarioId);
}
