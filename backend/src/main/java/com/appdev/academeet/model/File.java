package com.appdev.academeet.model;

import jakarta.persistence.*;

@Entity
@Table(name = "files")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Integer fileId;

    @Column(nullable = false)
    private String name;

    @Column
    private String type;

    @Column
    private Double size;

    @Column(name = "upload_date")
    private java.time.LocalDate uploadDate;

    @Column(name = "has_password")
    private Boolean hasPassword;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private Session session;

    public File() {}

    public File(Integer fileId, String name) {
        this.fileId = fileId;
        this.name = name;
    }

    public Integer getFileId() { return fileId; }
    public void setFileId(Integer fileId) { this.fileId = fileId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Double getSize() { return size; }
    public void setSize(Double size) { this.size = size; }
    public java.time.LocalDate getUploadDate() { return uploadDate; }
    public void setUploadDate(java.time.LocalDate uploadDate) { this.uploadDate = uploadDate; }
    public Boolean getHasPassword() { return hasPassword; }
    public void setHasPassword(Boolean hasPassword) { this.hasPassword = hasPassword; }

    // minimal behaviors
    public void downloadFile() {
        // placeholder
    }
    public void deleteFile() {
        // placeholder
    }
    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }
}
