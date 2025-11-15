package com.appdev.academeet.repository;

import com.appdev.academeet.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    // We need this to check if a tag already exists
    Optional<Tag> findByName(String name);
}