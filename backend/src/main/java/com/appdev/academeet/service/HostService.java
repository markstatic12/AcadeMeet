package com.appdev.academeet.service;

import com.appdev.academeet.model.Host;
import com.appdev.academeet.repository.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HostService {
    
    @Autowired
    private HostRepository hostRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Create
    public Host createHost(Host host) {
        if (hostRepository.existsByEmail(host.getEmail())) {
            throw new RuntimeException("Host with this email already exists");
        }
        
        // Encrypt password if not already encrypted
        if (!host.getPassword().startsWith("$2a$")) {
            host.setPassword(passwordEncoder.encode(host.getPassword()));
        }
        
        return hostRepository.save(host);
    }
    
    // Read
    public List<Host> getAllHosts() {
        return hostRepository.findAll();
    }
    
    public Optional<Host> getHostById(Long id) {
        return hostRepository.findById(id);
    }
    
    public Optional<Host> getHostByEmail(String email) {
        return hostRepository.findByEmail(email);
    }
    
    public List<Host> searchHostsByName(String name) {
        return hostRepository.searchByName(name);
    }
    
    public List<Host> getHostsByProgram(String program) {
        return hostRepository.findByProgram(program);
    }
    
    // Update
    public Host updateHost(Long id, Host hostDetails) {
        Host host = hostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Host not found with id: " + id));
        
        host.setName(hostDetails.getName());
        host.setEmail(hostDetails.getEmail());
        host.setProgram(hostDetails.getProgram());
        host.setYearLevel(hostDetails.getYearLevel());
        host.setProfilePic(hostDetails.getProfilePic());
        
        // Only update password if provided and not empty
        if (hostDetails.getPassword() != null && !hostDetails.getPassword().isEmpty()) {
            if (!hostDetails.getPassword().startsWith("$2a$")) {
                host.setPassword(passwordEncoder.encode(hostDetails.getPassword()));
            }
        }
        
        // Update privileges if provided
        if (hostDetails.getPrivileges() != null) {
            host.setPrivileges(hostDetails.getPrivileges());
        }
        
        return hostRepository.save(host);
    }
    
    // Delete
    public void deleteHost(Long id) {
        Host host = hostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Host not found with id: " + id));
        hostRepository.delete(host);
    }
    
    // Add privilege
    public Host addPrivilege(Long id, String privilege) {
        Host host = hostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Host not found with id: " + id));
        host.addPrivilege(privilege);
        return hostRepository.save(host);
    }
    
    // Remove privilege
    public Host removePrivilege(Long id, String privilege) {
        Host host = hostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Host not found with id: " + id));
        host.removePrivilege(privilege);
        return hostRepository.save(host);
    }
}
