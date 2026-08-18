package com.donarg.api.oferta.repository;

import com.donarg.api.oferta.model.Oferta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfertaRepository extends JpaRepository<Oferta, Long> {

    List<Oferta> findByPublicacionId(Long publicacionId);

    boolean existsByPublicacionIdAndUsuarioId(Long publicacionId, Long usuarioId);
}
