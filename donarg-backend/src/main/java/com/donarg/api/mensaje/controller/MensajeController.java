package com.donarg.api.mensaje.controller;

import com.donarg.api.mensaje.dto.request.MensajeRequest;
import com.donarg.api.mensaje.dto.response.MensajeResponse;
import com.donarg.api.mensaje.service.MensajeService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mensajes")
@RequiredArgsConstructor
public class MensajeController {

    private final MensajeService mensajeService;

    @PostMapping
    public ResponseEntity<MensajeResponse> enviar(@Valid @RequestBody MensajeRequest request) {
        MensajeResponse response = mensajeService.enviar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MensajeResponse>> listarPorChat(@RequestParam Long chatId) {
        return ResponseEntity.ok(mensajeService.listarPorChat(chatId));
    }
}
