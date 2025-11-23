package com.appdev.academeet.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // ---------- Core queries (most flexible) ----------
    // Find single note by id and owner (optional status filter)
    Optional<Note> findByIdAndOwnerId(Long noteId, Long ownerId);
    Optional<Note> findByIdAndOwnerIdAndStatusNot(Long noteId, Long ownerId, Note.NoteStatus excludedStatus);

    // User's notes with flexible filtering
    List<Note> findByOwnerIdAndStatusNotOrderByCreatedAtDesc(Long ownerId, Note.NoteStatus excludedStatus);
    List<Note> findByOwnerIdAndStatusOrderByCreatedAtDesc(Long ownerId, Note.NoteStatus status);
    
    // Global feed with status filtering
    List<Note> findByStatusNotOrderByCreatedAtDesc(Note.NoteStatus excludedStatus);

    // Date range queries
    List<Note> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    List<Note> findByOwnerIdAndCreatedAtBetweenOrderByCreatedAtDesc(Long ownerId, LocalDateTime start, LocalDateTime end);

    // Tag-based queries (distinct to avoid duplicates from many-to-many joins)
    List<Note> findDistinctByTags_IdInAndStatusNotOrderByCreatedAtDesc(List<Long> tagIds, Note.NoteStatus excludedStatus);
    List<Note> findDistinctByOwnerIdAndTags_IdInOrderByCreatedAtDesc(Long ownerId, List<Long> tagIds);

    // Type-based queries
    List<Note> findByOwnerIdAndTypeAndStatusNotOrderByCreatedAtDesc(Long ownerId, Note.NoteType type, Note.NoteStatus excludedStatus);
    List<Note> findByTypeAndStatusNotOrderByCreatedAtDesc(Note.NoteType type, Note.NoteStatus excludedStatus);

}