package com.appdev.academeet.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Integer adminId;
    @Column(name = "role_level", nullable = false)
    private String roleLevel;
    // Constructors
    public Admin() {
    }
    public Admin(Integer adminId, String roleLevel) {
        this.adminId = adminId;
        this.roleLevel = roleLevel;
    }
    // Getters and Setters
    public Integer getAdminId() {
        return adminId;
    }
    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }
    public String getRoleLevel() {
        return roleLevel;
    }
    public void setRoleLevel(String roleLevel) {
        this.roleLevel = roleLevel;
    }

    // Domain-like helper methods (minimal implementations)
    public void manageUsers(Student student, String action) {
        // placeholder - implement management actions (create/update/delete/ban) as needed
    }

    public List<Session> monitorSessions() {
        // placeholder - return sessions to be monitored; actual implementation belongs in a service
        return new ArrayList<>();
    }

    public void enforcePolicies(Session session, String policy) {
        // placeholder - enforce policies on a given session
    }
    @Override
    public String toString() {
        return "Admin{" +
                "adminId=" + adminId +
                ", roleLevel='" + roleLevel + '\'' +
                '}';
    }
}