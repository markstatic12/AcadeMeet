package com.appdev.academeet.model;

import java.time.LocalDateTime;

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
@Table(name = "reports")
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private Student reporter;
    
    @Column(name = "reported_type", nullable = false, length = 20)
    private String reportedType;
    
    @Column(name = "reported_id", nullable = false)
    private Long reportedId;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 20)
    private String status = "PENDING";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private Admin reviewedBy;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public Report() {
    }
    
    public Report(Student reporter, String reportedType, Long reportedId, String reason) {
        this.reporter = reporter;
        this.reportedType = reportedType;
        this.reportedId = reportedId;
        this.reason = reason;
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
    
    public Long getReportId() {
        return reportId;
    }
    
    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }
    
    public Student getReporter() {
        return reporter;
    }
    
    public void setReporter(Student reporter) {
        this.reporter = reporter;
    }
    
    public String getReportedType() {
        return reportedType;
    }
    
    public void setReportedType(String reportedType) {
        this.reportedType = reportedType;
    }
    
    public Long getReportedId() {
        return reportedId;
    }
    
    public void setReportedId(Long reportedId) {
        this.reportedId = reportedId;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Admin getReviewedBy() {
        return reviewedBy;
    }
    
    public void setReviewedBy(Admin reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
    
    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }
    
    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
    
    public String getAdminNotes() {
        return adminNotes;
    }
    
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
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
    
    public void markAsReviewed(Admin admin, String notes) {
        this.status = "REVIEWED";
        this.reviewedBy = admin;
        this.reviewedAt = LocalDateTime.now();
        this.adminNotes = notes;
    }
    
    public void resolve(Admin admin, String notes) {
        this.status = "RESOLVED";
        this.reviewedBy = admin;
        this.reviewedAt = LocalDateTime.now();
        this.adminNotes = notes;
    }
    
    public void dismiss(Admin admin, String notes) {
        this.status = "DISMISSED";
        this.reviewedBy = admin;
        this.reviewedAt = LocalDateTime.now();
        this.adminNotes = notes;
    }
    
    @Override
    public String toString() {
        return "Report{" +
                "reportId=" + reportId +
                ", reportedType='" + reportedType + '\'' +
                ", reportedId=" + reportedId +
                ", status='" + status + '\'' +
                '}';
    }
}
