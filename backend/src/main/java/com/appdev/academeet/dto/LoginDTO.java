package com.appdev.academeet.dto;

/**
 * DTO for login requests.
 * Can accept either email or studentId for authentication.
 */
public class LoginDTO {
    private String email;
    private String studentId;
    private String password;
    
    // Constructors
    public LoginDTO() {
    }
    
    public LoginDTO(String email, String studentId, String password) {
        this.email = email;
        this.studentId = studentId;
        this.password = password;
    }
    
    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
