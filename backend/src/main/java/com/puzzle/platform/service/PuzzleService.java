package com.puzzle.platform.service;

import com.puzzle.platform.dto.PuzzleMove;
import com.puzzle.platform.model.Puzzle;
import com.puzzle.platform.repository.PuzzleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PuzzleService {
    
    @Autowired
    private PuzzleRepository puzzleRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public List<Puzzle> getAllPuzzles() {
        return puzzleRepository.findAll();
    }
    
    public Optional<Puzzle> getPuzzle(Long id) {
        return puzzleRepository.findById(id);
    }
    
    public Puzzle createPuzzle(String name, String solution, String rules) {
        if (!isValidSolution(solution)) {
            throw new IllegalArgumentException("Invalid solution format");
        }
        return puzzleRepository.save(new Puzzle(name, solution, rules));
    }
    
    @Transactional
    public boolean makeMove(PuzzleMove move) {
        if (!move.isValid()) return false;
        
        Optional<Puzzle> puzzleOpt = puzzleRepository.findByIdWithLock(move.getPuzzleId());
        if (puzzleOpt.isEmpty()) return false;
        
        Puzzle puzzle = puzzleOpt.get();
        puzzle.acquireWriteLock();
        
        try {
            if (puzzle.isSolved()) return false;
            
            String grid = puzzle.getGrid();
            int index = move.getRow() * 4 + move.getCol();
            
            StringBuilder newGrid = new StringBuilder(grid);
            newGrid.setCharAt(index, move.getValue());
            puzzle.setGrid(newGrid.toString());
            
            // Check if puzzle is solved
            if (newGrid.toString().equals(puzzle.getSolution())) {
                puzzle.setSolved(true);
                messagingTemplate.convertAndSend("/topic/puzzle/" + puzzle.getId() + "/solved", 
                    new PuzzleSolvedEvent(puzzle.getId(), move.getUserId()));
            }
            
            puzzleRepository.save(puzzle);
            
            // Broadcast move to all connected clients
            messagingTemplate.convertAndSend("/topic/puzzle/" + puzzle.getId() + "/moves", move);
            
            return true;
        } finally {
            puzzle.releaseWriteLock();
        }
    }
    
    private boolean isValidSolution(String solution) {
        return solution != null && solution.length() == 16 && 
               solution.matches("[01]+");
    }
    
    public static class PuzzleSolvedEvent {
        private Long puzzleId;
        private String solvedBy;
        
        public PuzzleSolvedEvent(Long puzzleId, String solvedBy) {
            this.puzzleId = puzzleId;
            this.solvedBy = solvedBy;
        }
        
        public Long getPuzzleId() { return puzzleId; }
        public String getSolvedBy() { return solvedBy; }
    }
}
