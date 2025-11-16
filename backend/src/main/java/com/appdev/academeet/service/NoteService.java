package com.appdev.academeet.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.NoteRequest;
import com.appdev.academeet.model.Note;
import com.appdev.academeet.model.Note.NoteStatus;
import com.appdev.academeet.model.Tag;
import com.appdev.academeet.model.User;
import com.appdev.academeet.model.UserSavedNote;
import com.appdev.academeet.repository.NoteRepository;
import com.appdev.academeet.repository.TagRepository;
import com.appdev.academeet.repository.UserRepository; // Assumed repository
import com.appdev.academeet.repository.UserSavedNoteRepository; // Assumed repository

@Service
public class NoteService {

    // Repositories for data access
    @Autowired private NoteRepository noteRepository;
    @Autowired private UserSavedNoteRepository userSavedNoteRepository;
    @Autowired private TagRepository tagRepository;
    @Autowired private UserRepository userRepository;

    private Note getOwnedActiveNote(Long noteId, Long ownerId) {
        return noteRepository.findByIdAndOwnerIdAndStatusNot(
                noteId, ownerId, NoteStatus.TRASH)
                .orElseThrow(() -> new RuntimeException("Note with ID " + noteId + " not found or access denied."));
    }

    private User getUserReference(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found."));
    }

    @Transactional
    public Note createNote(NoteRequest request, Long ownerId) {
        User owner = getUserReference(ownerId);
        
        Note newNote = new Note();
    
        newNote.setOwner(owner);
        newNote.setTitle(request.getTitle());
        newNote.setType(request.getType());
        newNote.setContent(request.getContent());
        newNote.setFilePath(request.getFilePath());
        newNote.setStatus(NoteStatus.ACTIVE); // Default status on creation

        // Handle Tags
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            if (tags.size() != request.getTagIds().size()) {
                 throw new IllegalArgumentException("One or more tags provided are invalid.");
            }
            newNote.setTags(tags);
        }
        
        return noteRepository.save(newNote);
    }
    
    @Transactional
    public Note updateNote(Long noteId, Long ownerId, NoteRequest request) {
        Note existingNote = getOwnedActiveNote(noteId, ownerId);
        
        if (request.getTitle() != null) existingNote.setTitle(request.getTitle());
        if (request.getContent() != null) existingNote.setContent(request.getContent());
        if (request.getFilePath() != null) existingNote.setFilePath(request.getFilePath());
        
        // Handle Tag updates
        if (request.getTagIds() != null) {
             List<Tag> newTags = tagRepository.findAllById(request.getTagIds());
             if (newTags.size() != request.getTagIds().size()) {
                 throw new IllegalArgumentException("One or more tags provided are invalid.");
            }
             existingNote.setTags(newTags); 
        }
        
        return noteRepository.save(existingNote);
    }
    
    @Transactional
    public void setNoteStatus(Long noteId, Long ownerId, NoteStatus newStatus) {
        Note note = getOwnedActiveNote(noteId, ownerId);
        
        // Logic for setting timestamps
        if (newStatus == NoteStatus.TRASH) {
            note.setDeletedAt(LocalDateTime.now()); // Start 3-day countdown
        } else {
            note.setDeletedAt(null); // Clear deleted_at if moving out of trash (unarchive/activate)
        }

        note.setStatus(newStatus);
        noteRepository.save(note);
    }

    @Transactional
    public void saveNote(Long noteId, Long userId) {
        if (userSavedNoteRepository.existsByUserIdAndNoteId(userId, noteId)) {
            throw new IllegalArgumentException("Note is already saved by this user.");
        }
        
        User user = getUserReference(userId);
        Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new RuntimeException("Note to save not found."));

        UserSavedNote savedNote = new UserSavedNote();
        savedNote.setUser(user);
        savedNote.setNote(note);
        savedNote.setSavedAt(LocalDateTime.now());
        
        userSavedNoteRepository.save(savedNote);
    }

    @Transactional
    public void unsaveNote(Long noteId, Long userId) {
        UserSavedNote savedNote = userSavedNoteRepository.findByUserIdAndNoteId(userId, noteId)
            .orElseThrow(() -> new RuntimeException("Note is not currently saved by this user."));

        userSavedNoteRepository.delete(savedNote);
    }
    
    public List<Note> getNotesByStatus(Long userId, NoteStatus status) {
        if (status == NoteStatus.ACTIVE) {
            // return active notes excluding trash, most recent first
            return noteRepository.findByOwnerIdAndStatusNotOrderByCreatedAtDesc(userId, NoteStatus.TRASH);
        }
        return noteRepository.findByOwnerIdAndStatusOrderByCreatedAtDesc(userId, status);
    }
    
    public List<Note> getSavedNotes(Long userId) {
        return userSavedNoteRepository.findByUserId(userId).stream()
            .map(UserSavedNote::getNote)
            .collect(Collectors.toList());
    }
}