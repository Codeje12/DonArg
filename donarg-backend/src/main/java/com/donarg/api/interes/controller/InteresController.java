package com.donarg.api.interes.controller;

import com.donarg.api.interes.dto.request.InteresRequest;
import com.donarg.api.interes.dto.response.InteresResponse;
import com.donarg.api.interes.service.InteresService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/intereses")
@RequiredArgsConstructor
public class InteresController {

    private final InteresService interesService;

    @PostMapping
    public ResponseEntity<InteresResponse> marcar(@Valid @RequestBody InteresRequest request) {
        InteresResponse response = interesService.marcar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<InteresResponse>> listarPorPublicacion(@RequestParam Long publicacionId) {
        return ResponseEntity.ok(interesService.listarPorPublicacion(publicacionId));
    }

    @GetMapping("/mios")
    public ResponseEntity<List<InteresResponse>> listarMios() {
        return ResponseEntity.ok(interesService.listarMios());
    }

    @GetMapping("/recibidos")
    public ResponseEntity<List<InteresResponse>> listarRecibidos() {
        return ResponseEntity.ok(interesService.listarRecibidos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        interesService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
