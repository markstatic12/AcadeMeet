package com.appdev.academeet.controller;

import com.appdev.academeet.model.Participant;
import com.appdev.academeet.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "http://localhost:5173")
public class ParticipantController {
    
    @Autowired
    private ParticipantService participantService;
    
    // Create
    @PostMapping
    public ResponseEntity<?> createParticipant(@RequestBody Participant participant) {
        try {
            Participant createdParticipant = participantService.createParticipant(participant);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdParticipant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Get all
    @GetMapping
    public ResponseEntity<List<Participant>> getAllParticipants() {
        List<Participant> participants = participantService.getAllParticipants();
        return ResponseEntity.ok(participants);
    }
    
    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getParticipantById(@PathVariable Long id) {
        Optional<Participant> participant = participantService.getParticipantById(id);
        if (participant.isPresent()) {
            return ResponseEntity.ok(participant.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Participant not found");
    }
    
    // Get by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getParticipantByEmail(@PathVariable String email) {
        Optional<Participant> participant = participantService.getParticipantByEmail(email);
        if (participant.isPresent()) {
            return ResponseEntity.ok(participant.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Participant not found");
    }
    
    // Search by name
    @GetMapping("/search")
    public ResponseEntity<List<Participant>> searchParticipantsByName(@RequestParam String name) {
        List<Participant> participants = participantService.searchParticipantsByName(name);
        return ResponseEntity.ok(participants);
    }
    
    // Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Participant>> getParticipantsByStatus(@PathVariable String status) {
        List<Participant> participants = participantService.getParticipantsByStatus(status);
        return ResponseEntity.ok(participants);
    }
    
    // Get by program
    @GetMapping("/program/{program}")
    public ResponseEntity<List<Participant>> getParticipantsByProgram(@PathVariable String program) {
        List<Participant> participants = participantService.getParticipantsByProgram(program);
        return ResponseEntity.ok(participants);
    }
    
    // Get by year level
    @GetMapping("/year/{yearLevel}")
    public ResponseEntity<List<Participant>> getParticipantsByYearLevel(@PathVariable Integer yearLevel) {
        List<Participant> participants = participantService.getParticipantsByYearLevel(yearLevel);
        return ResponseEntity.ok(participants);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateParticipant(@PathVariable Long id, @RequestBody Participant participant) {
        try {
            Participant updatedParticipant = participantService.updateParticipant(id, participant);
            return ResponseEntity.ok(updatedParticipant);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParticipant(@PathVariable Long id) {
        try {
            participantService.deleteParticipant(id);
            return ResponseEntity.ok("Participant deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            Participant participant = participantService.updateStatus(id, status);
            return ResponseEntity.ok(participant);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
