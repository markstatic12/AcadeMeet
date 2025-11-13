package com.appdev.academeet.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Student;
import com.appdev.academeet.model.Topic;
import com.appdev.academeet.repository.StudentRepository;
import com.appdev.academeet.repository.TopicRepository;

@Service
public class TopicService {
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    // Get all active topics
    @Transactional(readOnly = true)
    public List<Topic> getAllActiveTopics() {
        return topicRepository.findByIsActiveTrue();
    }
    
    // Get all predefined topics
    @Transactional(readOnly = true)
    public List<Topic> getPredefinedTopics() {
        return topicRepository.findByIsPredefinedTrue();
    }
    
    // Get user-created topics
    @Transactional(readOnly = true)
    public List<Topic> getUserCreatedTopics() {
        return topicRepository.findByIsPredefinedFalse();
    }
    
    // Get topic by ID
    @Transactional(readOnly = true)
    public Optional<Topic> getTopicById(Long topicId) {
        return topicRepository.findById(topicId);
    }
    
    // Get topic by name
    @Transactional(readOnly = true)
    public Optional<Topic> getTopicByName(String name) {
        return topicRepository.findByName(name);
    }
    
    // Search topics
    @Transactional(readOnly = true)
    public List<Topic> searchTopics(String keyword) {
        return topicRepository.searchByName(keyword);
    }
    
    // Get most popular topics
    @Transactional(readOnly = true)
    public List<Topic> getMostPopularTopics(int limit) {
        return topicRepository.findTopNPopular(limit);
    }
    
    // Create new topic
    @Transactional
    public Topic createTopic(String name, String description, String icon, String color, Long studentId) {
        // Check if topic already exists
        if (topicRepository.existsByNameIgnoreCase(name)) {
            throw new RuntimeException("Topic with name '" + name + "' already exists");
        }
        
        Topic topic = new Topic(name, description, icon, color, false);
        
        // Set creator if studentId provided
        if (studentId != null) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
            topic.setCreatedBy(student.getId());
        }
        
        return topicRepository.save(topic);
    }
    
    // Create predefined topic (admin only)
    @Transactional
    public Topic createPredefinedTopic(String name, String description, String icon, String color) {
        if (topicRepository.existsByNameIgnoreCase(name)) {
            throw new RuntimeException("Topic with name '" + name + "' already exists");
        }
        
        Topic topic = new Topic(name, description, icon, color, true);
        return topicRepository.save(topic);
    }
    
    // Update topic
    @Transactional
    public Topic updateTopic(Long topicId, String name, String description, String icon, String color) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + topicId));
        
        // Check if new name conflicts with existing topic
        if (name != null && !name.equals(topic.getName())) {
            if (topicRepository.existsByNameIgnoreCase(name)) {
                throw new RuntimeException("Topic with name '" + name + "' already exists");
            }
            topic.setName(name);
        }
        
        if (description != null) {
            topic.setDescription(description);
        }
        
        if (icon != null) {
            topic.setIcon(icon);
        }
        
        if (color != null) {
            topic.setColor(color);
        }
        
        return topicRepository.save(topic);
    }
    
    // Deactivate topic (soft delete)
    @Transactional
    public void deactivateTopic(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + topicId));
        
        topic.setIsActive(false);
        topicRepository.save(topic);
    }
    
    // Reactivate topic
    @Transactional
    public void reactivateTopic(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + topicId));
        
        topic.setIsActive(true);
        topicRepository.save(topic);
    }
    
    // Delete topic permanently
    @Transactional
    public void deleteTopic(Long topicId) {
        if (!topicRepository.existsById(topicId)) {
            throw new RuntimeException("Topic not found with id: " + topicId);
        }
        topicRepository.deleteById(topicId);
    }
    
    // Increment session count
    @Transactional
    public void incrementSessionCount(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + topicId));
        
        topic.incrementSessionsCount();
        topicRepository.save(topic);
    }
    
    // Decrement session count
    @Transactional
    public void decrementSessionCount(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + topicId));
        
        topic.decrementSessionsCount();
        topicRepository.save(topic);
    }
    
    // Get topics created by student
    @Transactional(readOnly = true)
    public List<Topic> getTopicsByStudent(Long studentId) {
        return topicRepository.findByCreatedById(studentId);
    }
}
