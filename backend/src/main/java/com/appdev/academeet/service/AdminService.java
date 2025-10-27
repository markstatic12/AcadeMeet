package com.appdev.academeet.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.academeet.model.Admin;
import com.appdev.academeet.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public Optional<Admin> findById(Integer id) {
        return adminRepository.findById(id);
    }

    public Optional<Admin> findByIdSecret(String idSecret) {
        return adminRepository.findByRoleLevel(idSecret);
    }

    public Admin create(Admin admin) {
        // Basic validation: roleLevel required
        if (admin.getRoleLevel() == null || admin.getRoleLevel().trim().isEmpty()) {
            throw new IllegalArgumentException("roleLevel is required");
        }
        if (adminRepository.existsByRoleLevel(admin.getRoleLevel())) {
            throw new IllegalArgumentException("An admin with this roleLevel already exists");
        }
        return adminRepository.save(admin);
    }

    public Admin update(Integer id, Admin admin) {
        Optional<Admin> existingOpt = adminRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new IllegalArgumentException("Admin not found");
        }

        Admin existing = existingOpt.get();

        if (admin.getRoleLevel() != null && !admin.getRoleLevel().equals(existing.getRoleLevel())) {
            if (adminRepository.existsByRoleLevel(admin.getRoleLevel())) {
                throw new IllegalArgumentException("An admin with this roleLevel already exists");
            }
            existing.setRoleLevel(admin.getRoleLevel());
        }

        return adminRepository.save(existing);
    }

    public void delete(Integer id) {
        adminRepository.deleteById(id);
    }
}
