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
    
    List<Note> findBySessionSessionId(Integer sessionId);
    
    List<Note> findByTitleContainingIgnoreCase(String title);
    
    List<Note> findByFileType(String fileType);
    
    List<Note> findByHasPromotion(Boolean hasPromotion);
    
    @Query("SELECT n FROM Note n WHERE n.session.sessionId = ?1 ORDER BY n.uploadedDate DESC")
    List<Note> findBySessionIdOrderByUploadedDateDesc(Integer sessionId);
    
    @Query("SELECT n FROM Note n WHERE n.hasPromotion = true ORDER BY n.uploadedDate DESC")
    List<Note> findPromotedNotes();
}
