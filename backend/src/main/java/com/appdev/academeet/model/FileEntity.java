package com.appdev.academeet.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Integer fileId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "size")
    private Double size;

    @Column(name = "upload_date", nullable = false)
    private LocalDate uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    @JsonIgnoreProperties({"files", "notes", "participants", "host"})
    private Session session;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ======================
    // Constructors
    // ======================
    public FileEntity() {}

    public FileEntity(Integer fileId, String name, String content, Double size, LocalDate uploadDate) {
        this.fileId = fileId;
        this.name = name;
        this.content = content;
        this.size = size;
        this.uploadDate = uploadDate;
    }

    // ======================
    // Lifecycle Callback
    // ======================
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (uploadDate == null) uploadDate = LocalDate.now();
    }

    // ======================
    // Getters
    // ======================
    public Integer getFileId() { return fileId; }
    public String getName() { return name; }
    public String getContent() { return content; }
    public Double getSize() { return size; }
    public LocalDate getUploadDate() { return uploadDate; }
    public Session getSession() { return session; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ======================
    // Setters
    // ======================
    public void setFileId(Integer fileId) { this.fileId = fileId; }
    public void setName(String name) { this.name = name; }
    public void setContent(String content) { this.content = content; }
    public void setSize(Double size) { this.size = size; }
    public void setUploadDate(LocalDate uploadDate) { this.uploadDate = uploadDate; }
    public void setSession(Session session) { this.session = session; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // ======================
    // toString
    // ======================
    @Override
    public String toString() {
        return "FileEntity{" +
                "fileId=" + fileId +
                ", name='" + name + '\'' +
                ", size=" + size +
                ", uploadDate=" + uploadDate +
                '}';
    }
}
