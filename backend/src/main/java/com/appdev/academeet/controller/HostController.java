package com.appdev.academeet.controller;

import com.appdev.academeet.model.Host;
import com.appdev.academeet.service.HostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hosts")
@CrossOrigin(origins = "http://localhost:5173")
public class HostController {
    
    @Autowired
    private HostService hostService;
    
    // Create
    @PostMapping
    public ResponseEntity<?> createHost(@RequestBody Host host) {
        try {
            Host createdHost = hostService.createHost(host);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHost);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Get all
    @GetMapping
    public ResponseEntity<List<Host>> getAllHosts() {
        List<Host> hosts = hostService.getAllHosts();
        return ResponseEntity.ok(hosts);
    }
    
    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getHostById(@PathVariable Long id) {
        Optional<Host> host = hostService.getHostById(id);
        if (host.isPresent()) {
            return ResponseEntity.ok(host.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Host not found");
    }
    
    // Get by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getHostByEmail(@PathVariable String email) {
        Optional<Host> host = hostService.getHostByEmail(email);
        if (host.isPresent()) {
            return ResponseEntity.ok(host.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Host not found");
    }
    
    // Search by name
    @GetMapping("/search")
    public ResponseEntity<List<Host>> searchHostsByName(@RequestParam String name) {
        List<Host> hosts = hostService.searchHostsByName(name);
        return ResponseEntity.ok(hosts);
    }
    
    // Get by program
    @GetMapping("/program/{program}")
    public ResponseEntity<List<Host>> getHostsByProgram(@PathVariable String program) {
        List<Host> hosts = hostService.getHostsByProgram(program);
        return ResponseEntity.ok(hosts);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHost(@PathVariable Long id, @RequestBody Host host) {
        try {
            Host updatedHost = hostService.updateHost(id, host);
            return ResponseEntity.ok(updatedHost);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHost(@PathVariable Long id) {
        try {
            hostService.deleteHost(id);
            return ResponseEntity.ok("Host deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Add privilege
    @PostMapping("/{id}/privileges")
    public ResponseEntity<?> addPrivilege(@PathVariable Long id, @RequestBody String privilege) {
        try {
            Host host = hostService.addPrivilege(id, privilege);
            return ResponseEntity.ok(host);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Remove privilege
    @DeleteMapping("/{id}/privileges")
    public ResponseEntity<?> removePrivilege(@PathVariable Long id, @RequestBody String privilege) {
        try {
            Host host = hostService.removePrivilege(id, privilege);
            return ResponseEntity.ok(host);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
