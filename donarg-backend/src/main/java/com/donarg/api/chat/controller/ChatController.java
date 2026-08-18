package com.donarg.api.chat.controller;

import com.donarg.api.chat.dto.response.ChatResponse;
import com.donarg.api.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{id}")
    public ResponseEntity<ChatResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<ChatResponse> buscarPorPublicacionId(@RequestParam Long publicacionId) {
        return ResponseEntity.ok(chatService.buscarPorPublicacionId(publicacionId));
    }
}
