package com.puzzle.platform.dto;

public class PuzzleMove {
    private Long puzzleId;
    private int row;
    private int col;
    private char value;
    private String userId;
    private long timestamp;
    
    public PuzzleMove() {}
    
    public PuzzleMove(Long puzzleId, int row, int col, char value, String userId) {
        this.puzzleId = puzzleId;
        this.row = row;
        this.col = col;
        this.value = value;
        this.userId = userId;
        this.timestamp = System.currentTimeMillis();
    }
    
    public boolean isValid() {
        return puzzleId != null && row >= 0 && row < 4 && col >= 0 && col < 4 
               && (value == '0' || value == '1') && userId != null;
    }
    
    // Getters and setters
    public Long getPuzzleId() { return puzzleId; }
    public void setPuzzleId(Long puzzleId) { this.puzzleId = puzzleId; }
    
    public int getRow() { return row; }
    public void setRow(int row) { this.row = row; }
    
    public int getCol() { return col; }
    public void setCol(int col) { this.col = col; }
    
    public char getValue() { return value; }
    public void setValue(char value) { this.value = value; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
