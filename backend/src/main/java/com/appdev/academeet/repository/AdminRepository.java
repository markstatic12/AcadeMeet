package com.appdev.academeet.repository;

import com.appdev.academeet.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    
    Optional<Admin> findByIdSecret(String idSecret);
    
    boolean existsByIdSecret(String idSecret);
}
