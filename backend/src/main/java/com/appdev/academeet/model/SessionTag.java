package com.appdev.academeet.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "session_tag", uniqueConstraints = {
    @UniqueConstraint(name = "uk_session_tag", columnNames = {"session_id", "tag_name"})
})
public class SessionTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Long tagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "tag_name", nullable = false, length = 50)
    private String tagName;

    public SessionTag() {
    }

    public SessionTag(Session session, String tagName) {
        this.session = session;
        this.tagName = tagName;
    }

    public Long getTagId() {
        return tagId;
    }

    public void setTagId(Long tagId) {
        this.tagId = tagId;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    @Override
    public String toString() {
        return "SessionTag{" +
                "tagId=" + tagId +
                ", sessionId=" + (session != null ? session.getId() : null) +
                ", tagName='" + tagName + '\'' +
                '}';
    }
}