package com.appdev.academeet.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.model.Report;
import com.appdev.academeet.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    // Submit a new report
    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody ReportRequest request) {
        try {
            Report report = reportService.submitReport(
                request.getReporterId(),
                request.getReportedType(),
                request.getReportedId(),
                request.getReason(),
                request.getDescription()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get all pending reports (admin)
    @GetMapping("/pending")
    public ResponseEntity<List<Report>> getPendingReports() {
        try {
            List<Report> reports = reportService.getPendingReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get reports by status (admin)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Report>> getReportsByStatus(@PathVariable String status) {
        try {
            List<Report> reports = reportService.getReportsByStatus(status.toUpperCase());
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get reports for specific content (admin)
    @GetMapping("/content")
    public ResponseEntity<List<Report>> getReportsForContent(
            @RequestParam String type,
            @RequestParam Long id) {
        try {
            List<Report> reports = reportService.getReportsForContent(type.toUpperCase(), id);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get reports submitted by a user
    @GetMapping("/user/{reporterId}")
    public ResponseEntity<List<Report>> getReportsByReporter(@PathVariable Long reporterId) {
        try {
            List<Report> reports = reportService.getReportsByReporter(reporterId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Mark report as reviewed (admin)
    @PutMapping("/{reportId}/review")
    public ResponseEntity<?> markAsReviewed(@PathVariable Long reportId, @RequestBody AdminActionRequest request) {
        try {
            Report report = reportService.markAsReviewed(
                reportId,
                request.getAdminId(),
                request.getAdminNotes()
            );
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Resolve a report (admin)
    @PutMapping("/{reportId}/resolve")
    public ResponseEntity<?> resolveReport(@PathVariable Long reportId, @RequestBody AdminActionRequest request) {
        try {
            Report report = reportService.resolveReport(
                reportId,
                request.getAdminId(),
                request.getAdminNotes()
            );
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Dismiss a report (admin)
    @PutMapping("/{reportId}/dismiss")
    public ResponseEntity<?> dismissReport(@PathVariable Long reportId, @RequestBody AdminActionRequest request) {
        try {
            Report report = reportService.dismissReport(
                reportId,
                request.getAdminId(),
                request.getAdminNotes()
            );
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get report statistics (admin)
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getReportStatistics() {
        try {
            Map<String, Long> stats = reportService.getReportStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get most reported content (admin)
    @GetMapping("/most-reported")
    public ResponseEntity<List<Object[]>> getMostReportedContent(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Object[]> content = reportService.getMostReportedContent(limit);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get reports by date range (admin)
    @GetMapping("/date-range")
    public ResponseEntity<List<Report>> getReportsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<Report> reports = reportService.getReportsByDateRange(startDate, endDate);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get recent reports (admin)
    @GetMapping("/recent")
    public ResponseEntity<List<Report>> getRecentReports(
            @RequestParam(defaultValue = "7") int days) {
        try {
            List<Report> reports = reportService.getRecentReports(days);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get reports reviewed by admin
    @GetMapping("/reviewed-by/{adminId}")
    public ResponseEntity<List<Report>> getReportsReviewedByAdmin(@PathVariable Integer adminId) {
        try {
            List<Report> reports = reportService.getReportsReviewedByAdmin(adminId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Count pending reports (admin)
    @GetMapping("/count/pending")
    public ResponseEntity<Long> countPendingReports() {
        try {
            long count = reportService.countPendingReports();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Count unreviewed reports (admin)
    @GetMapping("/count/unreviewed")
    public ResponseEntity<Long> countUnreviewedReports() {
        try {
            long count = reportService.countUnreviewedReports();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Count reports for content
    @GetMapping("/count/content")
    public ResponseEntity<Long> countReportsForContent(
            @RequestParam String type,
            @RequestParam Long id) {
        try {
            long count = reportService.countReportsForContent(type.toUpperCase(), id);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Check if content is flagged (admin)
    @GetMapping("/flagged")
    public ResponseEntity<Map<String, Boolean>> checkContentFlagged(
            @RequestParam String type,
            @RequestParam Long id,
            @RequestParam(defaultValue = "3") int threshold) {
        try {
            boolean isFlagged = reportService.isContentFlagged(type.toUpperCase(), id, threshold);
            return ResponseEntity.ok(Map.of("isFlagged", isFlagged));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Bulk resolve all reports for content (admin)
    @PutMapping("/resolve-bulk")
    public ResponseEntity<?> resolveAllReportsForContent(@RequestBody BulkResolveRequest request) {
        try {
            reportService.resolveAllReportsForContent(
                request.getReportedType().toUpperCase(),
                request.getReportedId(),
                request.getAdminId(),
                request.getAdminNotes()
            );
            return ResponseEntity.ok().body("All reports resolved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Inner DTO classes
    public static class ReportRequest {
        private Long reporterId;
        private String reportedType;
        private Long reportedId;
        private String reason;
        private String description;
        
        public Long getReporterId() { return reporterId; }
        public void setReporterId(Long reporterId) { this.reporterId = reporterId; }
        
        public String getReportedType() { return reportedType; }
        public void setReportedType(String reportedType) { this.reportedType = reportedType; }
        
        public Long getReportedId() { return reportedId; }
        public void setReportedId(Long reportedId) { this.reportedId = reportedId; }
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    public static class AdminActionRequest {
        private Long adminId;
        private String adminNotes;
        
        public Long getAdminId() { return adminId; }
        public void setAdminId(Long adminId) { this.adminId = adminId; }
        
        public String getAdminNotes() { return adminNotes; }
        public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    }
    
    public static class BulkResolveRequest {
        private String reportedType;
        private Long reportedId;
        private Long adminId;
        private String adminNotes;
        
        public String getReportedType() { return reportedType; }
        public void setReportedType(String reportedType) { this.reportedType = reportedType; }
        
        public Long getReportedId() { return reportedId; }
        public void setReportedId(Long reportedId) { this.reportedId = reportedId; }
        
        public Long getAdminId() { return adminId; }
        public void setAdminId(Long adminId) { this.adminId = adminId; }
        
        public String getAdminNotes() { return adminNotes; }
        public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    }
}
