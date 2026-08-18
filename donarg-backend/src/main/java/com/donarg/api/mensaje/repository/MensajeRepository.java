package com.donarg.api.mensaje.repository;

import com.donarg.api.mensaje.model.Mensaje;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    List<Mensaje> findByChatIdOrderByFechaAsc(Long chatId);
}
