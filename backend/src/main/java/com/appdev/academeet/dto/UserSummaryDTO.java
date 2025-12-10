package com.appdev.academeet.dto;

public class UserSummaryDTO {
    private final Long id;
    private final String name;
    private final String email;
    private final String program;
    private final String profilePic;

    public UserSummaryDTO(Long id, String name, String email, String program, String profilePic) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.program = program;
        this.profilePic = profilePic;
    }

    // Getters only 
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getProgram() { return program; }
    public String getProfilePic() { return profilePic; }
}
