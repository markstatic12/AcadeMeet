package com.appdev.academeet.service;

import com.appdev.academeet.model.Admin;
import com.appdev.academeet.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    // Create
    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByIdSecret(admin.getIdSecret())) {
            throw new RuntimeException("Admin with this ID secret already exists");
        }
        return adminRepository.save(admin);
    }
    
    // Read
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
    
    public Optional<Admin> getAdminById(Integer id) {
        return adminRepository.findById(id);
    }
    
    public Optional<Admin> getAdminByIdSecret(String idSecret) {
        return adminRepository.findByIdSecret(idSecret);
    }
    
    // Update
    public Admin updateAdmin(Integer id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        
        admin.setIdSecret(adminDetails.getIdSecret());
        
        return adminRepository.save(admin);
    }
    
    // Delete
    public void deleteAdmin(Integer id) {
        Admin admin = adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        adminRepository.delete(admin);
    }
    
    // Verify admin
    public boolean verifyAdmin(String idSecret) {
        return adminRepository.existsByIdSecret(idSecret);
    }
}
