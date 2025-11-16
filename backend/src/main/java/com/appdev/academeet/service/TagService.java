package com.appdev.academeet.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Tag;
import com.appdev.academeet.repository.TagRepository;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;
    
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public Tag getTagById(Long tagId) {
        return tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found with ID: " + tagId));
    }

    @Transactional
    public Tag createTag(String tagName) {
        if (tagName == null || tagName.trim().isEmpty()) {
             throw new IllegalArgumentException("Tag name cannot be empty.");
        }
        
        Tag newTag = new Tag();
        newTag.setName(tagName.trim());
        
        return tagRepository.save(newTag);
    }

    @Transactional
    public void deleteTag(Long tagId) {
        if (!tagRepository.existsById(tagId)) {
            throw new RuntimeException("Tag not found with ID: " + tagId);
        }
        
        tagRepository.deleteById(tagId);
    }
}