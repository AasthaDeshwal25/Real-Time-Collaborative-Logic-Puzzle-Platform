package com.puzzle.platform.repository;

import com.puzzle.platform.model.Puzzle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface PuzzleRepository extends JpaRepository<Puzzle, Long> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Puzzle p WHERE p.id = :id")
    Optional<Puzzle> findByIdWithLock(Long id);
}
