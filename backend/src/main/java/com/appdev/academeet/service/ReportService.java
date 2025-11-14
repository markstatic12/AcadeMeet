package com.appdev.academeet.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Report;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.ReportRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Submit a new report
    @Transactional
    public Report submitReport(Long reporterId, String reportedType, Long reportedId, 
                               String reason, String description) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("Reporter not found with id: " + reporterId));
        
        // Check for duplicate reports within 24 hours
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        if (reportRepository.existsByReporterIdAndReportedTypeAndReportedIdAndCreatedAtAfter(
                reporterId, reportedType, reportedId, yesterday)) {
            throw new RuntimeException("You have already reported this content recently");
        }
        
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedType(reportedType);
        report.setReportedId(reportedId);
        report.setReason(reason);
        report.setDescription(description);
        report.setStatus("PENDING");
        report.setCreatedAt(LocalDateTime.now());
        
        return reportRepository.save(report);
    }
    
    // Get all pending reports
    @Transactional(readOnly = true)
    public List<Report> getPendingReports() {
        return reportRepository.findPendingReports();
    }
    
    // Get reports by status
    @Transactional(readOnly = true)
    public List<Report> getReportsByStatus(String status) {
        return reportRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    // Get reports for a specific content item
    @Transactional(readOnly = true)
    public List<Report> getReportsForContent(String reportedType, Long reportedId) {
        return reportRepository.findByReportedTypeAndReportedIdOrderByCreatedAtDesc(reportedType, reportedId);
    }
    
    // Get reports submitted by a user
    @Transactional(readOnly = true)
    public List<Report> getReportsByReporter(Long reporterId) {
        return reportRepository.findByReporterIdOrderByCreatedAtDesc(reporterId);
    }
    
    // Mark report as reviewed by admin
    @Transactional
    public Report markAsReviewed(Long reportId, Long adminId, String adminNotes) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        
        report.markAsReviewed(admin, adminNotes);
        return reportRepository.save(report);
    }
    
    // Resolve a report
    @Transactional
    public Report resolveReport(Long reportId, Long adminId, String adminNotes) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        
        report.resolve(admin, adminNotes);
        return reportRepository.save(report);
    }
    
    // Dismiss a report
    @Transactional
    public Report dismissReport(Long reportId, Long adminId, String adminNotes) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        
        report.dismiss(admin, adminNotes);
        return reportRepository.save(report);
    }
    
    // Count reports by status
    @Transactional(readOnly = true)
    public long countReportsByStatus(String status) {
        return reportRepository.countByStatus(status);
    }
    
    // Count pending reports
    @Transactional(readOnly = true)
    public long countPendingReports() {
        return reportRepository.countPendingReports();
    }
    
    // Count unreviewed reports
    @Transactional(readOnly = true)
    public long countUnreviewedReports() {
        return reportRepository.countUnreviewedReports();
    }
    
    // Count reports for a specific content item
    @Transactional(readOnly = true)
    public long countReportsForContent(String reportedType, Long reportedId) {
        return reportRepository.countByReportedTypeAndReportedId(reportedType, reportedId);
    }
    
    // Get most reported content
    @Transactional(readOnly = true)
    public List<Object[]> getMostReportedContent(int limit) {
        return reportRepository.findMostReportedEntities(limit);
    }
    
    // Get reports within date range
    @Transactional(readOnly = true)
    public List<Report> getReportsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return reportRepository.findReportsByDateRange(startDate, endDate);
    }
    
    // Get reports reviewed by admin
    @Transactional(readOnly = true)
    public List<Report> getReportsReviewedByAdmin(Integer adminId) {
        return reportRepository.findReportsReviewedByAdmin(Long.valueOf(adminId));
    }
    
    // Get report statistics
    @Transactional(readOnly = true)
    public Map<String, Long> getReportStatistics() {
        Object stats = reportRepository.getReportStatistics();
        // The stats will be a Map due to the 'new map' in JPQL
        @SuppressWarnings("unchecked")
        Map<String, Long> result = (Map<String, Long>) stats;
        return result;
    }
    
    // Check if content is flagged (has multiple unresolved reports)
    @Transactional(readOnly = true)
    public boolean isContentFlagged(String reportedType, Long reportedId, int threshold) {
        long reportCount = reportRepository.countByReportedTypeAndReportedIdAndStatusIn(
                reportedType, reportedId, List.of("PENDING", "REVIEWED"));
        return reportCount >= threshold;
    }
    
    // Get recent reports (last N days)
    @Transactional(readOnly = true)
    public List<Report> getRecentReports(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        return reportRepository.findReportsByDateRange(cutoffDate, LocalDateTime.now());
    }
    
    // Bulk update reports for content
    @Transactional
    public void resolveAllReportsForContent(String reportedType, Long reportedId, Long adminId, String adminNotes) {
        List<Report> reports = reportRepository.findByReportedTypeAndReportedIdOrderByCreatedAtDesc(reportedType, reportedId);
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        
        reports.forEach(report -> {
            if (!"RESOLVED".equals(report.getStatus()) && !"DISMISSED".equals(report.getStatus())) {
                report.resolve(admin, adminNotes);
            }
        });
        
        reportRepository.saveAll(reports);
    }
}
