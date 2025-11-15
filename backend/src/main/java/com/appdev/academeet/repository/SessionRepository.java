package com.appdev.academeet.repository;

import com.appdev.academeet.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    /**
     * Finds all sessions and orders them by their start time in ascending order.
     * This is used to display the "upcoming sessions" feed.
     */
    List<Session> findAllByOrderByStartDateTimeAsc();
}