package com.donarg.api.valoracion.controller;

import com.donarg.api.valoracion.dto.request.ValoracionRequest;
import com.donarg.api.valoracion.dto.response.ValoracionResponse;
import com.donarg.api.valoracion.service.ValoracionService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/valoraciones")
@RequiredArgsConstructor
public class ValoracionController {

    private final ValoracionService valoracionService;

    @PostMapping
    public ResponseEntity<ValoracionResponse> crear(@Valid @RequestBody ValoracionRequest request) {
        ValoracionResponse response = valoracionService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ValoracionResponse>> listarPorPublicacion(@RequestParam Long publicacionId) {
        return ResponseEntity.ok(valoracionService.listarPorPublicacion(publicacionId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ValoracionResponse>> listarPorUsuarioEvaluado(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(valoracionService.listarPorUsuarioEvaluado(usuarioId));
    }
}
