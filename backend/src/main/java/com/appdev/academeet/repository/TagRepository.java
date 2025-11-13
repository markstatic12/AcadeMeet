package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findByName(String name);
    
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Tag> searchTags(@Param("search") String search);
    
    @Query("SELECT t FROM Tag t ORDER BY t.usageCount DESC")
    List<Tag> findAllByPopularity();
    
    @Query("SELECT t FROM Tag t WHERE t.usageCount > :minUsage ORDER BY t.usageCount DESC")
    List<Tag> findPopularTags(@Param("minUsage") Integer minUsage);
    
    @Query("SELECT t FROM Tag t WHERE t.tagId IN :tagIds")
    List<Tag> findByTagIdIn(@Param("tagIds") List<Long> tagIds);
    
    @Query("SELECT t FROM Tag t WHERE t.usageCount = 0")
    List<Tag> findUnusedTags();
    
    @Modifying
    @Query("DELETE FROM Tag t WHERE t.usageCount = 0")
    void deleteUnusedTags();
    
    boolean existsByName(String name);
    
    @Query("SELECT DISTINCT t FROM Tag t JOIN t.sessions s WHERE s.sessionId = :sessionId")
    List<Tag> findTagsBySession(@Param("sessionId") Integer sessionId);
    
    // Additional methods for service compatibility
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Tag t WHERE LOWER(t.name) = LOWER(:name)")
    boolean existsByNameIgnoreCase(@Param("name") String name);
    
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) = LOWER(:name)")
    Optional<Tag> findByNameIgnoreCase(@Param("name") String name);
    
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Tag> searchByName(@Param("keyword") String keyword);
    
    @Query("SELECT t FROM Tag t ORDER BY t.usageCount DESC LIMIT :limit")
    List<Tag> findTopNPopular(@Param("limit") int limit);
    
    @Query("SELECT t FROM Tag t WHERE t.usageCount >= :minCount ORDER BY t.usageCount DESC")
    List<Tag> findByMinUsageCount(@Param("minCount") int minCount);
}
