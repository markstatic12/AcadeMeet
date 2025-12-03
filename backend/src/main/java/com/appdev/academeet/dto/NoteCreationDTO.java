package com.appdev.academeet.dto;

/**
 * DTO for creating/uploading a note.
 * Links a file to a session.
 */
public class NoteCreationDTO {
    private String filepath; // Path to the uploaded file
    private String description; // Optional description of the note
    
    // Constructors
    public NoteCreationDTO() {
    }
    
    public NoteCreationDTO(String filepath, String description) {
        this.filepath = filepath;
        this.description = description;
    }
    
    // Getters and Setters
    public String getFilepath() {
        return filepath;
    }
    
    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
