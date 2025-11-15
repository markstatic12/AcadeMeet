package com.appdev.academeet.repository;

// UPDATED: Import FileEntity
import com.appdev.academeet.model.FileEntity; 
import com.appdev.academeet.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
// UPDATED: Renamed to FileEntity
public interface FileRepository extends JpaRepository<FileEntity, Integer> { 
    
    // UPDATED: Returns List<FileEntity>
    List<FileEntity> findBySession(Session session);
    
    // UPDATED: Correct JPA query by convention (session.id) and correct type (Long)
    List<FileEntity> findBySessionId(Long sessionId); 
    
    // UPDATED: Returns List<FileEntity>
    List<FileEntity> findByNameContainingIgnoreCase(String name);
    
    // UPDATED: Returns List<FileEntity>
    List<FileEntity> findByUploadDate(LocalDate uploadDate);
    
    // UPDATED: Query now uses FileEntity and f.session.id, parameter is Long
    @Query("SELECT f FROM FileEntity f WHERE f.session.id = ?1 ORDER BY f.uploadDate DESC")
    List<FileEntity> findBySessionIdOrderByUploadDateDesc(Long sessionId);
    
    // UPDATED: Query now uses FileEntity
    @Query("SELECT f FROM FileEntity f WHERE f.size > ?1")
    List<FileEntity> findFilesLargerThan(Double size);
}