package com.appdev.academeet.dto;

public class AdminActionRequest {
    private Integer adminId;
    private String adminNotes;
    
    // Constructors
    public AdminActionRequest() {}
    
    public AdminActionRequest(Integer adminId, String adminNotes) {
        this.adminId = adminId;
        this.adminNotes = adminNotes;
    }
    
    // Getters and Setters
    public Integer getAdminId() {
        return adminId;
    }
    
    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }
    
    public String getAdminNotes() {
        return adminNotes;
    }
    
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
