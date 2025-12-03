package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Authentication/Read
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByStudentId(String studentId);
    
    // Profile Search
    Optional<User> findByName(String name);
    List<User> findByProgram(String program);
    List<User> findByFullnameContaining(String keyword);
}
