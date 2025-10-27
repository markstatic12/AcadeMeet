package com.appdev.academeet.repository;

import com.appdev.academeet.model.File;
import com.appdev.academeet.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File, Integer> {
    
    List<File> findBySession(Session session);
    
    List<File> findBySessionSessionId(Integer sessionId);
    
    List<File> findByNameContainingIgnoreCase(String name);
    
    List<File> findByUploadDate(LocalDate uploadDate);
    
    @Query("SELECT f FROM File f WHERE f.session.sessionId = ?1 ORDER BY f.uploadDate DESC")
    List<File> findBySessionIdOrderByUploadDateDesc(Integer sessionId);
    
    @Query("SELECT f FROM File f WHERE f.size > ?1")
    List<File> findFilesLargerThan(Double size);
}
