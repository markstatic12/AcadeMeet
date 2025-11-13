package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    
    Optional<Topic> findByName(String name);
    
    List<Topic> findByIsActiveTrue();
    
    List<Topic> findByIsPredefinedTrue();
    
    @Query("SELECT t FROM Topic t WHERE t.isPredefined = false AND t.createdBy = :createdBy")
    List<Topic> findCustomTopicsByCreator(@Param("createdBy") Long createdBy);
    
    @Query("SELECT t FROM Topic t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Topic> searchTopics(@Param("search") String search);
    
    @Query("SELECT t FROM Topic t WHERE t.isActive = true ORDER BY t.sessionsCount DESC")
    List<Topic> findTopicsByPopularity();
    
    @Query("SELECT t FROM Topic t WHERE t.sessionsCount > :minCount")
    List<Topic> findTopicsWithMinimumSessions(@Param("minCount") Integer minCount);
    
    @Query("SELECT COUNT(t) FROM Topic t WHERE t.isPredefined = false AND t.createdBy = :createdBy")
    Long countCustomTopicsByStudent(@Param("createdBy") Long createdBy);
    
    boolean existsByName(String name);
    
    // Additional methods for service compatibility
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Topic t WHERE LOWER(t.name) = LOWER(:name)")
    boolean existsByNameIgnoreCase(@Param("name") String name);
    
    @Query("SELECT t FROM Topic t WHERE t.isPredefined = false")
    List<Topic> findByIsPredefinedFalse();
    
    @Query("SELECT t FROM Topic t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Topic> searchByName(@Param("keyword") String keyword);
    
    @Query("SELECT t FROM Topic t WHERE t.isActive = true ORDER BY t.sessionsCount DESC")
    List<Topic> findTopNPopular(@Param("limit") int limit);
    
    @Query("SELECT t FROM Topic t WHERE t.createdBy = :studentId")
    List<Topic> findByCreatedById(@Param("studentId") Long studentId);
}
