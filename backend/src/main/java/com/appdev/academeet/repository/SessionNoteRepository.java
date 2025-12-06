package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.SessionNote;

@Repository
public interface SessionNoteRepository extends JpaRepository<SessionNote, String> {

    List<SessionNote> findBySession_Id(Long sessionId);
    long countBySession_Id(Long sessionId);
    void deleteBySession_Id(Long sessionId);
}