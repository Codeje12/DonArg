package com.donarg.api.publicacion.repository;

import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {

    @Query("""
            SELECT p FROM Publicacion p
            WHERE (:tipo IS NULL OR p.tipoPublicacion = :tipo)
              AND (:estado IS NULL OR p.estado = :estado)
              AND (:categoriaId IS NULL OR p.categoria.id = :categoriaId)
            ORDER BY p.fechaPublicacion DESC
            """)
    List<Publicacion> buscarConFiltros(@Param("tipo") TipoPublicacion tipo,
                                        @Param("estado") EstadoPublicacion estado,
                                        @Param("categoriaId") Long categoriaId);
}
