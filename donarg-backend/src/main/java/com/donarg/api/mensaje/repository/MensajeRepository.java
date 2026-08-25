package com.donarg.api.mensaje.repository;

import com.donarg.api.mensaje.model.Mensaje;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    List<Mensaje> findByChatIdOrderByFechaAsc(Long chatId);

    Optional<Mensaje> findTopByChatIdOrderByFechaDesc(Long chatId);

    long countByChatIdAndUsuarioIdNotAndLeidoFalse(Long chatId, Long usuarioId);

    @Modifying
    @Query("UPDATE Mensaje m SET m.leido = true WHERE m.chat.id = :chatId AND m.usuario.id <> :usuarioId AND m.leido = false")
    void marcarLeidos(@Param("chatId") Long chatId, @Param("usuarioId") Long usuarioId);
}
