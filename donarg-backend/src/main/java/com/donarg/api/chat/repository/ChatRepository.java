package com.donarg.api.chat.repository;

import com.donarg.api.chat.model.Chat;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByPublicacionId(Long publicacionId);

    boolean existsByPublicacionId(Long publicacionId);
}
