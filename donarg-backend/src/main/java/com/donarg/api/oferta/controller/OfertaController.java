package com.donarg.api.oferta.controller;

import com.donarg.api.oferta.dto.request.OfertaRequest;
import com.donarg.api.oferta.dto.response.OfertaResponse;
import com.donarg.api.oferta.service.OfertaService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ofertas")
@RequiredArgsConstructor
public class OfertaController {

    private final OfertaService ofertaService;

    @PostMapping
    public ResponseEntity<OfertaResponse> ofrecer(@Valid @RequestBody OfertaRequest request) {
        OfertaResponse response = ofertaService.ofrecer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OfertaResponse>> listarPorPublicacion(@RequestParam Long publicacionId) {
        return ResponseEntity.ok(ofertaService.listarPorPublicacion(publicacionId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ofertaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
