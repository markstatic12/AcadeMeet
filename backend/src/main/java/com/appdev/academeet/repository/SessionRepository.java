package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByHost_Id(Long userId);  
    List<Session> findAllByOrderByStartTime();
}