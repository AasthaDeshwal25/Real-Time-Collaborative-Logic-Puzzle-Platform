package com.puzzle.platform.service;

import com.puzzle.platform.dto.PuzzleMove;
import com.puzzle.platform.model.Puzzle;
import com.puzzle.platform.repository.PuzzleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PuzzleServiceTest {

    @Mock
    private PuzzleRepository puzzleRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private PuzzleService puzzleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testMakeMoveSuccess() {
        // Given
        Puzzle puzzle = new Puzzle("Test", "1111000000000000", "Test rules");
        puzzle.setId(1L);
        puzzle.setGrid("0000000000000000");
        
        PuzzleMove move = new PuzzleMove(1L, 0, 0, '1', "user1");
        
        when(puzzleRepository.findByIdWithLock(1L)).thenReturn(Optional.of(puzzle));
        when(puzzleRepository.save(any(Puzzle.class))).thenReturn(puzzle);

        // When
        boolean result = puzzleService.makeMove(move);

        // Then
        assertTrue(result);
        verify(messagingTemplate).convertAndSend(eq("/topic/puzzle/1/moves"), eq(move));
    }

    @Test
    void testMakeMoveInvalidMove() {
        // Given
        PuzzleMove invalidMove = new PuzzleMove(1L, 5, 0, '1', "user1"); // Invalid row

        // When
        boolean result = puzzleService.makeMove(invalidMove);

        // Then
        assertFalse(result);
        verifyNoInteractions(puzzleRepository);
    }

    @Test
    void testCreatePuzzleInvalidSolution() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
            puzzleService.createPuzzle("Test", "invalid", "Rules"));
    }
}
