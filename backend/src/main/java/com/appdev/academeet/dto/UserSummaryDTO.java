package com.appdev.academeet.dto;

/**
 * Simple DTO for users in lists (followers, following, etc.)
 */
public class UserSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private String program;
    private String profilePic;

    public UserSummaryDTO() {}

    public UserSummaryDTO(Long id, String name, String email, String program, String profilePic) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.program = program;
        this.profilePic = profilePic;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }
}
