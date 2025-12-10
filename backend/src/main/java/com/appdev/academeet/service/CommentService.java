package com.appdev.academeet.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.CommentDTO;
import com.appdev.academeet.dto.ReplyDTO;
import com.appdev.academeet.model.Comment;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.CommentRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Autowired
    public CommentService(CommentRepository commentRepository, 
                         SessionRepository sessionRepository,
                         UserRepository userRepository,
                         NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public void createComment(Long userId, Long sessionId, String content) {
        // Keep backward-compatible wrapper that delegates to the new create method
        createComment(userId, sessionId, content, null);
    }
    
    @Transactional
    public Comment createComment(Long userId, Long sessionId, String content, Long parentCommentId) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        Comment parentComment = null;
        if (parentCommentId != null) {
            parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

            if (!parentComment.getSession().getId().equals(sessionId)) {
                throw new IllegalArgumentException("Parent comment must be in the same session");
            }

            parentComment = parentComment.getParentComment() != null ? parentComment.getParentComment() : parentComment;
        }

        Comment comment = new Comment(session, user, content, parentComment);
        Comment saved = commentRepository.save(comment);

        if (parentComment != null) {
            commentRepository.updateReplyCount(parentComment.getCommentId(), 1);
            notificationService.notifyCommentReply(parentComment.getAuthor(), user, session);
        } else {
            notificationService.notifyCommentOnSession(user, session);
        }

        return saved;
    }

    @Transactional
    public void createReply(Long userId, Long sessionId, Long parentCommentId, String content) {
        createComment(userId, sessionId, content, parentCommentId);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getSessionCommentsGrouped(Long sessionId) {
        List<Comment> allComments = commentRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);

        Map<Long, CommentDTO> parentCommentsMap = new HashMap<>();
        List<Long> parentIds = new ArrayList<>();

        for (Comment comment : allComments) {
            if (comment.getParentComment() == null) {
                CommentDTO dto = new CommentDTO(
                    comment.getCommentId(),
                    comment.getAuthor().getId(),
                    comment.getAuthor().getName(),
                    comment.getAuthor().getProfileImageUrl(),
                    comment.getContent(),
                    comment.getCreatedAt(),
                    comment.getReplyCount()
                );
                parentCommentsMap.put(comment.getCommentId(), dto);
                parentIds.add(comment.getCommentId());
            }
        }

        Map<Long, List<ReplyDTO>> repliesMap = new HashMap<>();
        if (!parentIds.isEmpty()) {
            List<Comment> replies = commentRepository.findByParentComment_CommentIdIn(parentIds);
            for (Comment reply : replies) {
                Long parentId = reply.getParentComment().getCommentId();
                ReplyDTO replyDTO = new ReplyDTO(
                    reply.getCommentId(),
                    reply.getAuthor().getId(),
                    reply.getAuthor().getName(),
                    reply.getAuthor().getProfileImageUrl(),
                    reply.getContent(),
                    reply.getCreatedAt(),
                    null,
                    null
                );
                repliesMap.computeIfAbsent(parentId, k -> new ArrayList<>()).add(replyDTO);
            }
        }

        List<CommentDTO> result = new ArrayList<>();
        for (CommentDTO parentDTO : parentCommentsMap.values()) {
            parentDTO.setReplies(repliesMap.getOrDefault(parentDTO.getCommentId(), new ArrayList<>()));
            result.add(parentDTO);
        }

        result.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));

        return result;
    }

    @Transactional(readOnly = true)
    public List<ReplyDTO> getReplies(Long commentId) {
        List<Comment> replies = commentRepository.findByParentComment_CommentId(commentId);
        List<ReplyDTO> dtoList = new ArrayList<>();
        for (Comment reply : replies) {
            ReplyDTO dto = new ReplyDTO(
                reply.getCommentId(),
                reply.getAuthor().getId(),
                reply.getAuthor().getName(),
                reply.getAuthor().getProfileImageUrl(),
                reply.getContent(),
                reply.getCreatedAt(),
                null,
                null
            );
            dtoList.add(dto);
        }
        return dtoList;
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new SecurityException("User not authorized to delete this comment");
        }

        Comment parent = comment.getParentComment();
        if (parent != null) {
            commentRepository.delete(comment);
            commentRepository.updateReplyCount(parent.getCommentId(), -1);
        } else {
            commentRepository.delete(comment);
        }
    }

    @Transactional
    public CommentDTO createCommentAndGetDTO(Long userId, Long sessionId, String content) {
        Comment saved = createComment(userId, sessionId, content, null);
        return new CommentDTO(
            saved.getCommentId(),
            saved.getAuthor().getId(),
            saved.getAuthor().getName(),
            saved.getAuthor().getProfileImageUrl(),
            saved.getContent(),
            saved.getCreatedAt(),
            saved.getReplyCount()
        );
    }

    @Transactional
    public ReplyDTO createReplyAndGetDTO(Long userId, Long sessionId, Long commentId, String content) {
        Comment saved = createComment(userId, sessionId, content, commentId);
        return new ReplyDTO(
            saved.getCommentId(),
            saved.getAuthor().getId(),
            saved.getAuthor().getName(),
            saved.getAuthor().getProfileImageUrl(),
            saved.getContent(),
            saved.getCreatedAt(),
            null,
            null
        );
    }
}