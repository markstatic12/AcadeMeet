package com.appdev.academeet.repository;

import com.appdev.academeet.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    
    Optional<Participant> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<Participant> findByStatus(String status);
    
    @Query("SELECT p FROM Participant p WHERE p.name LIKE %?1%")
    List<Participant> searchByName(String name);
    
    @Query("SELECT p FROM Participant p WHERE p.program = ?1")
    List<Participant> findByProgram(String program);
    
    @Query("SELECT p FROM Participant p WHERE p.yearLevel = ?1")
    List<Participant> findByYearLevel(Integer yearLevel);
}
