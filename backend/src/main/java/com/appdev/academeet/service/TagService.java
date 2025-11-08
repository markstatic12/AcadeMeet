package com.appdev.academeet.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Tag;
import com.appdev.academeet.repository.TagRepository;

@Service
public class TagService {
    
    @Autowired
    private TagRepository tagRepository;
    
    // Get all tags
    @Transactional(readOnly = true)
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }
    
    // Get tag by ID
    @Transactional(readOnly = true)
    public Optional<Tag> getTagById(Long tagId) {
        return tagRepository.findById(tagId);
    }
    
    // Get tag by name (case-insensitive)
    @Transactional(readOnly = true)
    public Optional<Tag> getTagByName(String name) {
        return tagRepository.findByNameIgnoreCase(name);
    }
    
    // Search tags
    @Transactional(readOnly = true)
    public List<Tag> searchTags(String keyword) {
        return tagRepository.searchByName(keyword);
    }
    
    // Get most popular tags
    @Transactional(readOnly = true)
    public List<Tag> getMostPopularTags(int limit) {
        return tagRepository.findTopNPopular(limit);
    }
    
    // Get tags with minimum usage count
    @Transactional(readOnly = true)
    public List<Tag> getTagsByMinUsage(int minCount) {
        return tagRepository.findByMinUsageCount(minCount);
    }
    
    // Create tag
    @Transactional
    public Tag createTag(String name) {
        // Check if tag already exists
        Optional<Tag> existing = tagRepository.findByNameIgnoreCase(name);
        if (existing.isPresent()) {
            return existing.get();
        }
        
        Tag tag = new Tag(name);
        return tagRepository.save(tag);
    }
    
    // Find or create tag
    @Transactional
    public Tag findOrCreateTag(String name) {
        Optional<Tag> existing = tagRepository.findByNameIgnoreCase(name);
        if (existing.isPresent()) {
            return existing.get();
        }
        Tag tag = new Tag(name);
        return tagRepository.save(tag);
    }
    
    // Find or create multiple tags
    @Transactional
    public List<Tag> findOrCreateTags(List<String> tagNames) {
        return tagNames.stream()
                .map(this::findOrCreateTag)
                .toList();
    }
    
    // Update tag
    @Transactional
    public Tag updateTag(Long tagId, String name) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + tagId));
        
        // Check if new name conflicts
        if (!name.equals(tag.getName())) {
            if (tagRepository.existsByNameIgnoreCase(name)) {
                throw new RuntimeException("Tag with name '" + name + "' already exists");
            }
            tag.setName(name);
        }
        
        return tagRepository.save(tag);
    }
    
    // Delete tag
    @Transactional
    public void deleteTag(Long tagId) {
        if (!tagRepository.existsById(tagId)) {
            throw new RuntimeException("Tag not found with id: " + tagId);
        }
        tagRepository.deleteById(tagId);
    }
    
    // Increment usage count
    @Transactional
    public void incrementUsageCount(Long tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + tagId));
        
        tag.incrementUsageCount();
        tagRepository.save(tag);
    }
    
    // Decrement usage count
    @Transactional
    public void decrementUsageCount(Long tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + tagId));
        
        tag.decrementUsageCount();
        tagRepository.save(tag);
    }
    
    // Get tags by IDs
    @Transactional(readOnly = true)
    public List<Tag> getTagsByIds(List<Long> tagIds) {
        return tagRepository.findByTagIdIn(tagIds);
    }
    
    // Clean up unused tags (usage count = 0)
    @Transactional
    public int cleanupUnusedTags() {
        List<Tag> unusedTags = tagRepository.findByMinUsageCount(0);
        unusedTags = unusedTags.stream()
                .filter(tag -> tag.getUsageCount() == 0)
                .toList();
        
        int count = unusedTags.size();
        tagRepository.deleteAll(unusedTags);
        return count;
    }
}
