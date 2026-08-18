package com.donarg.api.reclamo.repository;

import com.donarg.api.reclamo.model.EstadoReclamo;
import com.donarg.api.reclamo.model.Reclamo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReclamoRepository extends JpaRepository<Reclamo, Long> {

    List<Reclamo> findByPublicacionId(Long publicacionId);

    List<Reclamo> findByPublicacionIdAndEstado(Long publicacionId, EstadoReclamo estado);
}
