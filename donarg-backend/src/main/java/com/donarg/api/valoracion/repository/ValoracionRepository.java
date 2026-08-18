package com.donarg.api.valoracion.repository;

import com.donarg.api.valoracion.model.Valoracion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {

    List<Valoracion> findByPublicacionId(Long publicacionId);

    List<Valoracion> findByUsuarioEvaluadoId(Long usuarioEvaluadoId);

    boolean existsByPublicacionIdAndUsuarioEvaluadorId(Long publicacionId, Long usuarioEvaluadorId);
}
