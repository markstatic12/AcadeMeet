package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByName(String name);
    List<User> findByProgram(String program);
    List<User> findByYearLevel(Integer yearLevel);

    // Legacy method retained for compatibility
    List<User> findByNameContaining(String keyword);

    // SQL LIKE-based search across name, email, and program (case-insensitive)
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))" )
    List<User> searchByKeyword(@Param("keyword") String keyword);
}
