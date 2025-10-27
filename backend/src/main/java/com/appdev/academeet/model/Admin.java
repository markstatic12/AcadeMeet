package com.appdev.academeet.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin") // Zander Aligato's Work
public class Admin {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Integer adminId;
    
    @Column(name = "id_secret", nullable = false, unique = true)
    private String idSecret;
    
    public Admin() {
    }
    
    public Admin(Integer adminId, String idSecret) {
        this.adminId = adminId;
        this.idSecret = idSecret;
    }
    
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
