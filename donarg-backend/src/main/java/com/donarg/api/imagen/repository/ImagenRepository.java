package com.donarg.api.imagen.repository;

import com.donarg.api.imagen.model.Imagen;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImagenRepository extends JpaRepository<Imagen, Long> {

    List<Imagen> findByPublicacionId(Long publicacionId);
}
