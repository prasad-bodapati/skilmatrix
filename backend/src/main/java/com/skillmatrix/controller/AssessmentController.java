package com.skillmatrix.controller;

import com.skillmatrix.dto.AuthDtos.*;
import com.skillmatrix.entity.*;
import com.skillmatrix.repository.QuestionRepository;
import com.skillmatrix.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {
    private final AssessmentService assessmentService;
    private final QuestionRepository questionRepo;

    public AssessmentController(AssessmentService assessmentService, QuestionRepository questionRepo) {
        this.assessmentService = assessmentService;
        this.questionRepo = questionRepo;
    }

    @PostMapping("/invite")
    public ResponseEntity<?> createInvite(@RequestBody AssessmentInviteRequest req) {
        try {
            AssessmentInvite invite = assessmentService.createInvite(req);
            Map<String, Object> result = new HashMap<>();
            result.put("id", invite.getId());
            result.put("status", invite.getStatus().name());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/start/{inviteId}")
    public ResponseEntity<?> startAttempt(@PathVariable Long inviteId, Authentication auth) {
        try {
            Long userId = (Long) auth.getCredentials();
            AssessmentAttempt attempt = assessmentService.startAttempt(inviteId, userId);

            Assessment assessment = attempt.getAssessment();
            List<Question> questions = questionRepo.findByComponentIdAndDifficultyLevelLessThanEqual(
                    assessment.getComponent().getId(), assessment.getLevel());
            Collections.shuffle(questions);
            int numQ = Math.min(assessment.getNumberOfQuestions(), questions.size());
            List<Question> selected = questions.subList(0, numQ);

            Map<String, Object> result = new HashMap<>();
            result.put("attemptId", attempt.getId());
            result.put("questions", selected.stream().map(q -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", q.getId());
                m.put("questionText", q.getQuestionText());
                m.put("type", q.getType().name());
                m.put("difficultyLevel", q.getDifficultyLevel());
                m.put("options", q.getOptions());
                return m;
            }).collect(Collectors.toList()));
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/submit/{attemptId}")
    public ResponseEntity<?> submitAttempt(@PathVariable Long attemptId, @RequestBody List<SubmitAnswerRequest> answers, Authentication auth) {
        try {
            Long userId = (Long) auth.getCredentials();
            AssessmentAttempt attempt = assessmentService.submitAttempt(attemptId, userId, answers);

            Map<String, Object> result = new HashMap<>();
            result.put("id", attempt.getId());
            result.put("score", attempt.getScore());
            result.put("totalQuestions", attempt.getTotalQuestions());
            result.put("passed", attempt.isPassed());
            result.put("status", attempt.getStatus().name());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/grade")
    public ResponseEntity<?> gradeAnswer(@RequestBody GradeAnswerRequest req) {
        try {
            assessmentService.gradeAnswer(req);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
