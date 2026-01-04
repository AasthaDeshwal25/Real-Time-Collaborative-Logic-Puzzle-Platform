package com.puzzle.platform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Entity
@Table(name = "puzzles")
public class Puzzle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, length = 16)
    private String grid = "0000000000000000"; // 4x4 grid as string
    
    @Column(nullable = false, length = 16)
    private String solution = "0000000000000000";
    
    @Column(nullable = false)
    private String rules;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "is_solved")
    private boolean solved = false;
    
    @Version
    private Long version = 0L;
    
    @Transient
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    
    public Puzzle() {}
    
    public Puzzle(String name, String solution, String rules) {
        this.name = name;
        this.solution = solution;
        this.rules = rules;
    }
    
    public void acquireReadLock() { lock.readLock().lock(); }
    public void releaseReadLock() { lock.readLock().unlock(); }
    public void acquireWriteLock() { lock.writeLock().lock(); }
    public void releaseWriteLock() { lock.writeLock().unlock(); }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getGrid() { return grid; }
    public void setGrid(String grid) { this.grid = grid; }
    
    public String getSolution() { return solution; }
    public void setSolution(String solution) { this.solution = solution; }
    
    public String getRules() { return rules; }
    public void setRules(String rules) { this.rules = rules; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public boolean isSolved() { return solved; }
    public void setSolved(boolean solved) { this.solved = solved; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
