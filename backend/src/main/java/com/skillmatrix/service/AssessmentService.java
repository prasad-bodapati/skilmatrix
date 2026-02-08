package com.skillmatrix.service;

import com.skillmatrix.dto.AuthDtos.*;
import com.skillmatrix.entity.*;
import com.skillmatrix.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssessmentService {
    private final AssessmentRepository assessmentRepo;
    private final AssessmentInviteRepository inviteRepo;
    private final AssessmentAttemptRepository attemptRepo;
    private final QuestionRepository questionRepo;
    private final DeveloperLevelRepository levelRepo;
    private final AppUserRepository userRepo;

    public AssessmentService(AssessmentRepository assessmentRepo, AssessmentInviteRepository inviteRepo,
                             AssessmentAttemptRepository attemptRepo, QuestionRepository questionRepo,
                             DeveloperLevelRepository levelRepo, AppUserRepository userRepo) {
        this.assessmentRepo = assessmentRepo;
        this.inviteRepo = inviteRepo;
        this.attemptRepo = attemptRepo;
        this.questionRepo = questionRepo;
        this.levelRepo = levelRepo;
        this.userRepo = userRepo;
    }

    public AssessmentInvite createInvite(AssessmentInviteRequest req) {
        AppUser dev = userRepo.findById(req.developerId)
                .orElseThrow(() -> new RuntimeException("Developer not found"));
        Assessment assessment = assessmentRepo.findById(req.assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        AssessmentInvite invite = new AssessmentInvite();
        invite.setDeveloper(dev);
        invite.setAssessment(assessment);
        invite.setStatus(AssessmentInvite.InviteStatus.PENDING);
        return inviteRepo.save(invite);
    }

    @Transactional
    public AssessmentAttempt startAttempt(Long inviteId, Long developerId) {
        AssessmentInvite invite = inviteRepo.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getDeveloper().getId().equals(developerId)) {
            throw new RuntimeException("This invite is not for you");
        }

        invite.setStatus(AssessmentInvite.InviteStatus.ACCEPTED);
        inviteRepo.save(invite);

        Assessment assessment = invite.getAssessment();
        List<Question> questions = questionRepo.findByComponentIdAndDifficultyLevelLessThanEqual(
                assessment.getComponent().getId(), assessment.getLevel());

        Collections.shuffle(questions);
        int numQuestions = Math.min(assessment.getNumberOfQuestions(), questions.size());
        List<Question> selectedQuestions = questions.subList(0, numQuestions);

        AssessmentAttempt attempt = new AssessmentAttempt();
        attempt.setDeveloper(invite.getDeveloper());
        attempt.setAssessment(assessment);
        attempt.setTotalQuestions(numQuestions);
        attempt.setStatus(AssessmentAttempt.AttemptStatus.IN_PROGRESS);
        attempt = attemptRepo.save(attempt);

        return attempt;
    }

    public List<Question> getAttemptQuestions(Long attemptId, Long developerId) {
        AssessmentAttempt attempt = attemptRepo.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (!attempt.getDeveloper().getId().equals(developerId)) {
            throw new RuntimeException("Not authorized");
        }

        Assessment assessment = attempt.getAssessment();
        List<Question> questions = questionRepo.findByComponentIdAndDifficultyLevelLessThanEqual(
                assessment.getComponent().getId(), assessment.getLevel());

        Collections.shuffle(questions);
        return questions.stream().limit(attempt.getTotalQuestions()).collect(Collectors.toList());
    }

    @Transactional
    public AssessmentAttempt submitAttempt(Long attemptId, Long developerId, List<SubmitAnswerRequest> answers) {
        AssessmentAttempt attempt = attemptRepo.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (!attempt.getDeveloper().getId().equals(developerId)) {
            throw new RuntimeException("Not authorized");
        }

        boolean hasFillInBlank = false;
        int correctCount = 0;

        for (SubmitAnswerRequest ans : answers) {
            Question question = questionRepo.findById(ans.questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            AttemptAnswer answer = new AttemptAnswer();
            answer.setAttempt(attempt);
            answer.setQuestion(question);
            answer.setGivenAnswer(ans.answer);

            if (question.getType() == Question.QuestionType.MCQ) {
                boolean isCorrect = ans.answer != null && ans.answer.equalsIgnoreCase(question.getCorrectAnswer());
                answer.setCorrect(isCorrect);
                answer.setReviewed(true);
                if (isCorrect) correctCount++;
            } else {
                answer.setReviewed(false);
                hasFillInBlank = true;
            }

            attempt.getAnswers().add(answer);
        }

        attempt.setScore(correctCount);
        attempt.setCompletedAt(LocalDateTime.now());

        if (hasFillInBlank) {
            attempt.setStatus(AssessmentAttempt.AttemptStatus.PENDING_REVIEW);
        } else {
            finalizeAttempt(attempt);
        }

        return attemptRepo.save(attempt);
    }

    @Transactional
    public AttemptAnswer gradeAnswer(GradeAnswerRequest req) {
        AttemptAnswer answer = null;
        for (AssessmentAttempt attempt : attemptRepo.findAll()) {
            for (AttemptAnswer a : attempt.getAnswers()) {
                if (a.getId().equals(req.answerId)) {
                    answer = a;
                    break;
                }
            }
            if (answer != null) break;
        }

        if (answer == null) throw new RuntimeException("Answer not found");

        answer.setCorrect(req.correct);
        answer.setReviewed(true);

        AssessmentAttempt attempt = answer.getAttempt();
        boolean allReviewed = attempt.getAnswers().stream().allMatch(AttemptAnswer::isReviewed);
        if (allReviewed) {
            int correctCount = (int) attempt.getAnswers().stream().filter(AttemptAnswer::isCorrect).count();
            attempt.setScore(correctCount);
            finalizeAttempt(attempt);
            attemptRepo.save(attempt);
        }

        return answer;
    }

    private void finalizeAttempt(AssessmentAttempt attempt) {
        Assessment assessment = attempt.getAssessment();
        double percentage = (double) attempt.getScore() / attempt.getTotalQuestions() * 100;
        boolean passed = percentage >= assessment.getPassMarkPercentage();
        attempt.setPassed(passed);
        attempt.setStatus(AssessmentAttempt.AttemptStatus.GRADED);

        if (passed) {
            DeveloperLevel devLevel = levelRepo
                    .findByDeveloperIdAndComponentId(attempt.getDeveloper().getId(), assessment.getComponent().getId())
                    .orElseGet(() -> {
                        DeveloperLevel dl = new DeveloperLevel();
                        dl.setDeveloper(attempt.getDeveloper());
                        dl.setComponent(assessment.getComponent());
                        return dl;
                    });

            if (assessment.getLevel() > devLevel.getCurrentLevel()) {
                devLevel.setCurrentLevel(assessment.getLevel());
                devLevel.setLastLevelUpAt(LocalDateTime.now());
                levelRepo.save(devLevel);
            }
        }
    }
}
