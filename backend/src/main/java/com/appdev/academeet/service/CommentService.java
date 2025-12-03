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

    @Autowired
    public CommentService(CommentRepository commentRepository, 
                         SessionRepository sessionRepository,
                         UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void createComment(Long userId, Long sessionId, String content) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        Comment comment = new Comment(session, user, content, null);
        commentRepository.save(comment);
    }

    @Transactional
    public void createReply(Long userId, Long sessionId, Long parentCommentId, String content) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        Comment parentComment = commentRepository.findById(parentCommentId)
            .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        
        // Always attach to root comment for single-level nesting
        Comment rootComment = parentComment.getParentComment() != null 
            ? parentComment.getParentComment() 
            : parentComment;
        
        Comment reply = new Comment(session, user, content, rootComment);
        commentRepository.save(reply);
        
        // Increment reply count
        rootComment.incrementReplyCount();
        commentRepository.save(rootComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getSessionCommentsGrouped(Long sessionId) {
        // Get all comments for the session
        List<Comment> allComments = commentRepository.findAll()
            .stream()
            .filter(c -> c.getSession().getId().equals(sessionId))
            .toList();
        
        // Separate parent comments and replies
        Map<Long, CommentDTO> parentCommentsMap = new HashMap<>();
        Map<Long, List<ReplyDTO>> repliesMap = new HashMap<>();
        
        // Build parent comments map
        for (Comment comment : allComments) {
            if (comment.getParentComment() == null) {
                CommentDTO dto = new CommentDTO(
                    comment.getCommentId(),
                    comment.getUser().getId(),
                    comment.getUser().getName(),
                    comment.getContent(),
                    comment.getCreatedAt(),
                    comment.getReplyCount()
                );
                parentCommentsMap.put(comment.getCommentId(), dto);
                repliesMap.put(comment.getCommentId(), new ArrayList<>());
            }
        }
        
        // Add replies to their parent comments
        for (Comment comment : allComments) {
            if (comment.getParentComment() != null) {
                Long parentId = comment.getParentComment().getCommentId();
                
                ReplyDTO replyDTO = new ReplyDTO(
                    comment.getCommentId(),
                    comment.getUser().getId(),
                    comment.getUser().getName(),
                    comment.getContent(),
                    comment.getCreatedAt(),
                    null,  // Simplified - no @mention tracking
                    null
                );
                
                if (repliesMap.containsKey(parentId)) {
                    repliesMap.get(parentId).add(replyDTO);
                }
            }
        }
        
        // Combine parent comments with their replies
        List<CommentDTO> result = new ArrayList<>();
        for (CommentDTO parentDTO : parentCommentsMap.values()) {
            parentDTO.setReplies(repliesMap.get(parentDTO.getCommentId()));
            result.add(parentDTO);
        }
        
        // Sort by creation date
        result.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
        
        return result;
    }
}