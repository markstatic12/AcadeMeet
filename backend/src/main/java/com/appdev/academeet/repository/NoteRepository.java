package com.appdev.academeet.repository;

import com.appdev.academeet.model.Note;
import com.appdev.academeet.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Integer> {
    
    List<Note> findBySession(Session session);
    
    // UPDATED: Correct JPA convention and data type
    List<Note> findBySessionId(Long sessionId);
    
    List<Note> findByTitleContainingIgnoreCase(String title);
    
    List<Note> findByFileType(String fileType);
    
    List<Note> findByHasPromotion(Boolean hasPromotion);
    
    // UPDATED: Query path is n.session.id and parameter is Long
    @Query("SELECT n FROM Note n WHERE n.session.id = ?1 ORDER BY n.uploadedDate DESC")
    List<Note> findBySessionIdOrderByUploadedDateDesc(Long sessionId);
    
    @Query("SELECT n FROM Note n WHERE n.hasPromotion = true ORDER BY n.uploadedDate DESC")
    List<Note> findPromotedNotes();
}