package com.donarg.api.publicacion.repository;

import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.Publicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {

    @Query("""
            SELECT p FROM Publicacion p
            WHERE (:tipo IS NULL OR p.tipoPublicacion = :tipo)
              AND (:estado IS NULL OR p.estado = :estado)
              AND (:categoriaId IS NULL OR p.categoria.id = :categoriaId)
              AND (:usuarioId IS NULL OR p.usuario.id = :usuarioId)
            ORDER BY p.fechaPublicacion DESC
            """)
    Page<Publicacion> buscarConFiltros(@Param("tipo") TipoPublicacion tipo,
                                        @Param("estado") EstadoPublicacion estado,
                                        @Param("categoriaId") Long categoriaId,
                                        @Param("usuarioId") Long usuarioId,
                                        Pageable pageable);
}
