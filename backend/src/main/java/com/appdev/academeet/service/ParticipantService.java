package com.appdev.academeet.service;

import com.appdev.academeet.model.Participant;
import com.appdev.academeet.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipantService {
    
    @Autowired
    private ParticipantRepository participantRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Create
    public Participant createParticipant(Participant participant) {
        if (participantRepository.existsByEmail(participant.getEmail())) {
            throw new RuntimeException("Participant with this email already exists");
        }
        
        // Encrypt password if not already encrypted
        if (!participant.getPassword().startsWith("$2a$")) {
            participant.setPassword(passwordEncoder.encode(participant.getPassword()));
        }
        
        return participantRepository.save(participant);
    }
    
    // Read
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }
    
    public Optional<Participant> getParticipantById(Long id) {
        return participantRepository.findById(id);
    }
    
    public Optional<Participant> getParticipantByEmail(String email) {
        return participantRepository.findByEmail(email);
    }
    
    public List<Participant> searchParticipantsByName(String name) {
        return participantRepository.searchByName(name);
    }
    
    public List<Participant> getParticipantsByStatus(String status) {
        return participantRepository.findByStatus(status);
    }
    
    public List<Participant> getParticipantsByProgram(String program) {
        return participantRepository.findByProgram(program);
    }
    
    public List<Participant> getParticipantsByYearLevel(Integer yearLevel) {
        return participantRepository.findByYearLevel(yearLevel);
    }
    
    // Update
    public Participant updateParticipant(Long id, Participant participantDetails) {
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));
        
        participant.setName(participantDetails.getName());
        participant.setEmail(participantDetails.getEmail());
        participant.setProgram(participantDetails.getProgram());
        participant.setYearLevel(participantDetails.getYearLevel());
        participant.setProfilePic(participantDetails.getProfilePic());
        participant.setJoinDate(participantDetails.getJoinDate());
        participant.setStatus(participantDetails.getStatus());
        
        // Only update password if provided and not empty
        if (participantDetails.getPassword() != null && !participantDetails.getPassword().isEmpty()) {
            if (!participantDetails.getPassword().startsWith("$2a$")) {
                participant.setPassword(passwordEncoder.encode(participantDetails.getPassword()));
            }
        }
        
        return participantRepository.save(participant);
    }
    
    // Delete
    public void deleteParticipant(Long id) {
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));
        participantRepository.delete(participant);
    }
    
    // Update status
    public Participant updateStatus(Long id, String status) {
        Participant participant = participantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));
        participant.setStatus(status);
        return participantRepository.save(participant);
    }
}
