package com.donarg.api.imagen.controller;

import com.donarg.api.imagen.dto.response.ImagenResponse;
import com.donarg.api.imagen.service.ImagenService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/imagenes")
@RequiredArgsConstructor
public class ImagenController {

    private final ImagenService imagenService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImagenResponse> agregar(
            @RequestParam Long publicacionId,
            @RequestParam MultipartFile archivo) {
        ImagenResponse response = imagenService.agregar(publicacionId, archivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ImagenResponse>> listarPorPublicacion(@RequestParam Long publicacionId) {
        return ResponseEntity.ok(imagenService.listarPorPublicacion(publicacionId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        imagenService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
