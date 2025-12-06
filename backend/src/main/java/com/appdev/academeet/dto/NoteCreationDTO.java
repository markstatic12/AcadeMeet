package com.appdev.academeet.dto;

public class NoteCreationDTO {
    private String filepath; 
    private String description; 
    
    public NoteCreationDTO() {
    }
    
    public NoteCreationDTO(String filepath, String description) {
        this.filepath = filepath;
        this.description = description;
    }
    
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