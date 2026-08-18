package com.donarg.api.publicacion.controller;

import com.donarg.api.publicacion.dto.request.ElegirInteresadoRequest;
import com.donarg.api.publicacion.dto.request.PublicacionActualizacionRequest;
import com.donarg.api.publicacion.dto.request.PublicacionRequest;
import com.donarg.api.publicacion.dto.response.PublicacionResponse;
import com.donarg.api.publicacion.model.EstadoPublicacion;
import com.donarg.api.publicacion.model.TipoPublicacion;
import com.donarg.api.publicacion.service.PublicacionService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publicaciones")
@RequiredArgsConstructor
public class PublicacionController {

    private final PublicacionService publicacionService;

    @PostMapping
    public ResponseEntity<PublicacionResponse> crear(@Valid @RequestBody PublicacionRequest request) {
        PublicacionResponse response = publicacionService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PublicacionResponse>> listar(
            @RequestParam(required = false) TipoPublicacion tipo,
            @RequestParam(required = false) EstadoPublicacion estado,
            @RequestParam(required = false) Long categoriaId) {
        return ResponseEntity.ok(publicacionService.listar(tipo, estado, categoriaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicacionResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(publicacionService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublicacionResponse> actualizar(@PathVariable Long id,
                                                            @Valid @RequestBody PublicacionActualizacionRequest request) {
        return ResponseEntity.ok(publicacionService.actualizar(id, request));
    }

    @PatchMapping("/{id}/elegir-interesado")
    public ResponseEntity<PublicacionResponse> elegirInteresado(@PathVariable Long id,
                                                                  @Valid @RequestBody ElegirInteresadoRequest request) {
        return ResponseEntity.ok(publicacionService.elegirInteresado(id, request));
    }

    @PatchMapping("/{id}/cerrar")
    public ResponseEntity<PublicacionResponse> cerrar(@PathVariable Long id) {
        return ResponseEntity.ok(publicacionService.cerrar(id));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<PublicacionResponse> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(publicacionService.cancelar(id));
    }
}
