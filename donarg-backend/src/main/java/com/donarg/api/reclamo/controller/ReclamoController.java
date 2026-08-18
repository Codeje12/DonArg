package com.donarg.api.reclamo.controller;

import com.donarg.api.reclamo.dto.request.ReclamoRequest;
import com.donarg.api.reclamo.dto.response.ReclamoResponse;
import com.donarg.api.reclamo.service.ReclamoService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reclamos")
@RequiredArgsConstructor
public class ReclamoController {

    private final ReclamoService reclamoService;

    @PostMapping
    public ResponseEntity<ReclamoResponse> crear(@Valid @RequestBody ReclamoRequest request) {
        ReclamoResponse response = reclamoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ReclamoResponse>> listarPorPublicacion(@RequestParam Long publicacionId) {
        return ResponseEntity.ok(reclamoService.listarPorPublicacion(publicacionId));
    }

    @PatchMapping("/{id}/aceptar")
    public ResponseEntity<ReclamoResponse> aceptar(@PathVariable Long id) {
        return ResponseEntity.ok(reclamoService.aceptar(id));
    }

    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<ReclamoResponse> rechazar(@PathVariable Long id) {
        return ResponseEntity.ok(reclamoService.rechazar(id));
    }
}
