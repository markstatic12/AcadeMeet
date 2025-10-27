package com.appdev.academeet.repository;

import com.appdev.academeet.model.Host;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HostRepository extends JpaRepository<Host, Long> {
    
    Optional<Host> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT h FROM Host h WHERE h.name LIKE %?1%")
    List<Host> searchByName(String name);
    
    @Query("SELECT h FROM Host h WHERE h.program = ?1")
    List<Host> findByProgram(String program);
}
