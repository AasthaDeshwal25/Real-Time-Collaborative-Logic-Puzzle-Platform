package com.puzzle.platform.controller;

import com.puzzle.platform.model.Puzzle;
import com.puzzle.platform.service.PuzzleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/puzzles")
@CrossOrigin(origins = "http://localhost:3000")
public class PuzzleController {
    
    @Autowired
    private PuzzleService puzzleService;
    
    @GetMapping
    public List<Puzzle> getAllPuzzles() {
        return puzzleService.getAllPuzzles();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Puzzle> getPuzzle(@PathVariable Long id) {
        return puzzleService.getPuzzle(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Puzzle> createPuzzle(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String solution = request.get("solution");
            String rules = request.get("rules");
            
            if (name == null || solution == null || rules == null) {
                return ResponseEntity.badRequest().build();
            }
            
            Puzzle puzzle = puzzleService.createPuzzle(name, solution, rules);
            return ResponseEntity.ok(puzzle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
