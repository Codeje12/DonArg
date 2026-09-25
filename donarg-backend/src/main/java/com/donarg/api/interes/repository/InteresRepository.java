package com.donarg.api.interes.repository;

import com.donarg.api.interes.model.Interes;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InteresRepository extends JpaRepository<Interes, Long> {

    List<Interes> findByPublicacionId(Long publicacionId);

    List<Interes> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    List<Interes> findByPublicacion_Usuario_IdOrderByFechaDesc(Long usuarioId);

    boolean existsByPublicacionIdAndUsuarioId(Long publicacionId, Long usuarioId);
}
