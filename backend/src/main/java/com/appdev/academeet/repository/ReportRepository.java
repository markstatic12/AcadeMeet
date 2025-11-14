package com.appdev.academeet.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByStatus(String status);
    
    @Query("SELECT r FROM Report r WHERE r.reporter.id = :reporterId ORDER BY r.createdAt DESC")
    List<Report> findByReporter(@Param("reporterId") Long reporterId);
    
    @Query("SELECT r FROM Report r WHERE r.reportedType = :type AND r.reportedId = :id")
    List<Report> findByReportedContent(
        @Param("type") String type,
        @Param("id") Long id
    );
    
    @Query("SELECT r FROM Report r WHERE r.reviewedBy.id = :adminId ORDER BY r.reviewedAt DESC")
    List<Report> findByReviewer(@Param("adminId") Long adminId);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = :status")
    Long countByStatus(@Param("status") String status);
    
    @Query("SELECT r FROM Report r WHERE r.status = 'PENDING' ORDER BY r.createdAt ASC")
    List<Report> findPendingReports();
    
    @Query("SELECT r FROM Report r WHERE r.createdAt BETWEEN :startDate AND :endDate ORDER BY r.createdAt DESC")
    List<Report> findReportsByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT r.reportedType, COUNT(r) FROM Report r GROUP BY r.reportedType")
    List<Object[]> countReportsByType();
    
    @Query("SELECT r FROM Report r WHERE r.reportedType = :type ORDER BY r.createdAt DESC")
    List<Report> findByReportedType(@Param("type") String type);
    
    // Additional methods for service compatibility
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Report r " +
           "WHERE r.reporter.id = :reporterId AND r.reportedType = :type AND r.reportedId = :id " +
           "AND r.createdAt > :afterDate")
    boolean existsByReporterIdAndReportedTypeAndReportedIdAndCreatedAtAfter(
        @Param("reporterId") Long reporterId,
        @Param("type") String type,
        @Param("id") Long id,
        @Param("afterDate") LocalDateTime afterDate
    );
    
    @Query("SELECT r FROM Report r WHERE r.status = :status ORDER BY r.createdAt DESC")
    List<Report> findByStatusOrderByCreatedAtDesc(@Param("status") String status);
    
    @Query("SELECT r FROM Report r WHERE r.reportedType = :type AND r.reportedId = :id ORDER BY r.createdAt DESC")
    List<Report> findByReportedTypeAndReportedIdOrderByCreatedAtDesc(
        @Param("type") String type,
        @Param("id") Long id
    );
    
    @Query("SELECT r FROM Report r WHERE r.reporter.id = :reporterId ORDER BY r.createdAt DESC")
    List<Report> findByReporterIdOrderByCreatedAtDesc(@Param("reporterId") Long reporterId);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = 'PENDING'")
    Long countPendingReports();
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reviewedBy IS NULL")
    Long countUnreviewedReports();
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reportedType = :type AND r.reportedId = :id")
    Long countByReportedTypeAndReportedId(
        @Param("type") String type,
        @Param("id") Long id
    );
    
    @Query("SELECT r.reportedType, r.reportedId, COUNT(r) as reportCount " +
           "FROM Report r GROUP BY r.reportedType, r.reportedId " +
           "ORDER BY reportCount DESC LIMIT :limit")
    List<Object[]> findMostReportedEntities(@Param("limit") int limit);
    
    @Query("SELECT r FROM Report r WHERE r.reviewedBy.id = :adminId ORDER BY r.reviewedAt DESC")
    List<Report> findReportsReviewedByAdmin(@Param("adminId") Long adminId);
    
    @Query("SELECT new map(COUNT(r) as total, " +
           "SUM(CASE WHEN r.status = 'PENDING' THEN 1 ELSE 0 END) as pending, " +
           "SUM(CASE WHEN r.status = 'APPROVED' THEN 1 ELSE 0 END) as approved, " +
           "SUM(CASE WHEN r.status = 'REJECTED' THEN 1 ELSE 0 END) as rejected) " +
           "FROM Report r")
    Object getReportStatistics();
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reportedType = :type AND r.reportedId = :id AND r.status IN :statuses")
    Long countByReportedTypeAndReportedIdAndStatusIn(
        @Param("type") String type,
        @Param("id") Long id,
        @Param("statuses") List<String> statuses
    );
}
