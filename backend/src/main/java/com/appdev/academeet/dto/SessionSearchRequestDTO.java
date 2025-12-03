package com.appdev.academeet.dto;

import java.util.List;

/**
 * DTO for session search parameters.
 * Used to filter and paginate session searches (from URL query params).
 */
public class SessionSearchRequestDTO {
    private String keyword; // For title/overview search
    private List<String> tags;
    private String program;
    private Integer page;
    private Integer size;
    
    // Constructors
    public SessionSearchRequestDTO() {
    }
    
    public SessionSearchRequestDTO(String keyword, List<String> tags, String program, Integer page, Integer size) {
        this.keyword = keyword;
        this.tags = tags;
        this.program = program;
        this.page = page;
        this.size = size;
    }
    
    // Getters and Setters
    public String getKeyword() {
        return keyword;
    }
    
    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public String getProgram() {
        return program;
    }
    
    public void setProgram(String program) {
        this.program = program;
    }
    
    public Integer getPage() {
        return page;
    }
    
    public void setPage(Integer page) {
        this.page = page;
    }
    
    public Integer getSize() {
        return size;
    }
    
    public void setSize(Integer size) {
        this.size = size;
    }
}
