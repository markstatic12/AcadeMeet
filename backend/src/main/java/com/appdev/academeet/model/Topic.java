package com.appdev.academeet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "topics")
public class Topic {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topic_id")
    private Long topicId;
    
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 50)
    private String icon;
    
    @Column(length = 20)
    private String color;
    
    @Column(name = "is_predefined")
    private Boolean isPredefined = false;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "sessions_count")
    private Integer sessionsCount = 0;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public Topic() {
    }
    
    public Topic(String name, String description, String icon, String color) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.color = color;
    }
    
    public Topic(String name, String description, String icon, String color, Boolean isPredefined) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.isPredefined = isPredefined;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public Long getTopicId() {
        return topicId;
    }
    
    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public Boolean getIsPredefined() {
        return isPredefined;
    }
    
    public void setIsPredefined(Boolean isPredefined) {
        this.isPredefined = isPredefined;
    }
    
    public Long getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
    
    public Integer getSessionsCount() {
        return sessionsCount;
    }
    
    public void setSessionsCount(Integer sessionsCount) {
        this.sessionsCount = sessionsCount;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public void incrementSessionCount() {
        if (this.sessionsCount == null) {
            this.sessionsCount = 0;
        }
        this.sessionsCount++;
    }
    
    public void decrementSessionCount() {
        if (this.sessionsCount != null && this.sessionsCount > 0) {
            this.sessionsCount--;
        }
    }
    
    // Aliases for service layer compatibility
    public void incrementSessionsCount() {
        incrementSessionCount();
    }
    
    public void decrementSessionsCount() {
        decrementSessionCount();
    }
    
    @Override
    public String toString() {
        return "Topic{" +
                "topicId=" + topicId +
                ", name='" + name + '\'' +
                ", isPredefined=" + isPredefined +
                ", sessionsCount=" + sessionsCount +
                ", isActive=" + isActive +
                '}';
    }
}
