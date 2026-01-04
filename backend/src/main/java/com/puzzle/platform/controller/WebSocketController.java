package com.puzzle.platform.controller;

import com.puzzle.platform.dto.PuzzleMove;
import com.puzzle.platform.service.PuzzleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    
    @Autowired
    private PuzzleService puzzleService;
    
    @MessageMapping("/puzzle/move")
    public void handleMove(@Payload PuzzleMove move, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        move.setUserId(sessionId);
        puzzleService.makeMove(move);
    }
}
