package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.UserSavedNote;

@Repository
public interface UserSavedNoteRepository extends JpaRepository<UserSavedNote, Long> {
    
    /** * Finds a specific saved relationship entry by user ID and note ID.
     * Crucial for unsaving a note and checking if a note is already saved.
     */
    Optional<UserSavedNote> findByUserIdAndNoteId(Long userId, Long noteId);
    
    /** * Retrieves all saved notes (the linking entities) for a specific user.
     * Used to populate the user's "Saved Notes" list.
     */
    List<UserSavedNote> findByUserId(Long userId);

    /** * Checks efficiently if a specific note is saved by a specific user.
     * @return true if the relationship exists.
     */
    boolean existsByUserIdAndNoteId(Long userId, Long noteId);
}