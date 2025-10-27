package com.appdev.academeet.model;
 
import jakarta.persistence.*;
 
@Entity
@Table(name = "admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Integer adminId;
    @Column(name = "id_secret", nullable = false, unique = true)
    private String idSecret;
    // Constructors
    public Admin() {
    }
    public Admin(Integer adminId, String idSecret) {
        this.adminId = adminId;
        this.idSecret = idSecret;
    }
    // Getters and Setters
    public Integer getAdminId() {
        return adminId;
    }
    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }
    public String getIdSecret() {
        return idSecret;
    }
    public void setIdSecret(String idSecret) {
        this.idSecret = idSecret;
    }
    @Override
    public String toString() {
        return "Admin{" +
                "adminId=" + adminId +
                ", idSecret='" + idSecret + '\'' +
                '}';
    }
}