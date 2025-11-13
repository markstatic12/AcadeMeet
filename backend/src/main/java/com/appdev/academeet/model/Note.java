package com.appdev.academeet.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "notes") // All files related to notes are Camoro's work
public class Note {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private Integer noteId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    
    @Column(name = "file_type")
    private String fileType;
    
    // New fields for enhanced note functionality
    @Column(name = "note_type", length = 20)
    private String noteType = "TEXT"; // TEXT or FILE
    
    @Column(name = "file_url", length = 1000)
    private String fileUrl;
    
    @Column(name = "file_name", length = 255)
    private String fileName;
    
    @Column(name = "file_size")
    private Long fileSize; // in bytes
    
    @Column(name = "is_public")
    private Boolean isPublic = false;
    
    @Column(name = "is_downloadable")
    private Boolean isDownloadable = true;
    
    @Column(name = "views_count")
    private Integer viewsCount = 0;
    
    @Column(name = "downloads_count")
    private Integer downloadsCount = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    @JsonIgnoreProperties({"files", "notes", "participants", "host"})
    private Session session;
    
    @Column(name = "uploaded_date")
    private LocalDate uploadedDate;
    
    @Column(name = "has_promotion")
    private Boolean hasPromotion = false;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Note() {
    }
    
    public Note(Integer noteId, String title, String content, String fileType) {
        this.noteId = noteId;
        this.title = title;
        this.content = content;
        this.fileType = fileType;
    }
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (uploadedDate == null) {
            uploadedDate = LocalDate.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Integer getNoteId() {
        return noteId;
    }
    
    public void setNoteId(Integer noteId) {
        this.noteId = noteId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public Session getSession() {
        return session;
    }
    
    public void setSession(Session session) {
        this.session = session;
    }
    
    public LocalDate getUploadedDate() {
        return uploadedDate;
    }
    
    public void setUploadedDate(LocalDate uploadedDate) {
        this.uploadedDate = uploadedDate;
    }
    
    public Boolean getHasPromotion() {
        return hasPromotion;
    }
    
    public void setHasPromotion(Boolean hasPromotion) {
        this.hasPromotion = hasPromotion;
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
    
    // New fields getters and setters
    public String getNoteType() {
        return noteType;
    }
    
    public void setNoteType(String noteType) {
        this.noteType = noteType;
    }
    
    public String getFileUrl() {
        return fileUrl;
    }
    
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public Boolean getIsPublic() {
        return isPublic;
    }
    
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public Boolean getIsDownloadable() {
        return isDownloadable;
    }
    
    public void setIsDownloadable(Boolean isDownloadable) {
        this.isDownloadable = isDownloadable;
    }
    
    public Integer getViewsCount() {
        return viewsCount;
    }
    
    public void setViewsCount(Integer viewsCount) {
        this.viewsCount = viewsCount;
    }
    
    public Integer getDownloadsCount() {
        return downloadsCount;
    }
    
    public void setDownloadsCount(Integer downloadsCount) {
        this.downloadsCount = downloadsCount;
    }
    
    // Helper methods
    public void incrementViews() {
        if (this.viewsCount == null) {
            this.viewsCount = 0;
        }
        this.viewsCount++;
    }
    
    public void incrementDownloads() {
        if (this.downloadsCount == null) {
            this.downloadsCount = 0;
        }
        this.downloadsCount++;
    }
    
    @Override
    public String toString() {
        return "Note{" +
                "noteId=" + noteId +
                ", title='" + title + '\'' +
                ", fileType='" + fileType + '\'' +
                ", uploadedDate=" + uploadedDate +
                ", hasPromotion=" + hasPromotion +
                '}';
    }
}
