package com.skillmatrix.controller;

import com.skillmatrix.entity.*;
import com.skillmatrix.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class DataController {
    private final TeamRepository teamRepo;
    private final ProjectRepository projectRepo;
    private final ComponentRepository componentRepo;
    private final QuestionRepository questionRepo;
    private final AppUserRepository userRepo;
    private final AssessmentRepository assessmentRepo;
    private final DeveloperLevelRepository levelRepo;
    private final AssessmentAttemptRepository attemptRepo;
    private final AssessmentInviteRepository inviteRepo;

    public DataController(TeamRepository teamRepo, ProjectRepository projectRepo,
                          ComponentRepository componentRepo, QuestionRepository questionRepo,
                          AppUserRepository userRepo, AssessmentRepository assessmentRepo,
                          DeveloperLevelRepository levelRepo, AssessmentAttemptRepository attemptRepo,
                          AssessmentInviteRepository inviteRepo) {
        this.teamRepo = teamRepo;
        this.projectRepo = projectRepo;
        this.componentRepo = componentRepo;
        this.questionRepo = questionRepo;
        this.userRepo = userRepo;
        this.assessmentRepo = assessmentRepo;
        this.levelRepo = levelRepo;
        this.attemptRepo = attemptRepo;
        this.inviteRepo = inviteRepo;
    }

    @GetMapping("/teams")
    public ResponseEntity<?> getTeams() {
        List<Team> teams = teamRepo.findAll();
        List<Map<String, Object>> result = teams.stream().map(t -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", t.getId());
            m.put("name", t.getName());
            m.put("description", t.getDescription());
            m.put("projectCount", t.getProjects().size());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/teams/{teamId}/projects")
    public ResponseEntity<?> getProjects(@PathVariable Long teamId) {
        List<Project> projects = projectRepo.findByTeamId(teamId);
        List<Map<String, Object>> result = projects.stream().map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", p.getId());
            m.put("name", p.getName());
            m.put("description", p.getDescription());
            m.put("teamId", p.getTeam().getId());
            m.put("componentCount", p.getComponents().size());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/projects/{projectId}/components")
    public ResponseEntity<?> getComponents(@PathVariable Long projectId) {
        List<Component> components = componentRepo.findByProjectId(projectId);
        List<Map<String, Object>> result = components.stream().map(c -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", c.getId());
            m.put("name", c.getName());
            m.put("techStack", c.getTechStack());
            m.put("description", c.getDescription());
            m.put("projectId", c.getProject().getId());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/components/{componentId}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable Long componentId) {
        List<Question> questions = questionRepo.findByComponentId(componentId);
        List<Map<String, Object>> result = questions.stream().map(q -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", q.getId());
            m.put("questionText", q.getQuestionText());
            m.put("type", q.getType().name());
            m.put("difficultyLevel", q.getDifficultyLevel());
            m.put("options", q.getOptions());
            m.put("correctAnswer", q.getCorrectAnswer());
            m.put("componentId", q.getComponent().getId());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        List<AppUser> users = userRepo.findAll();
        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("email", u.getEmail());
            m.put("fullName", u.getFullName());
            m.put("role", u.getRole().name());
            m.put("emailVerified", u.isEmailVerified());
            m.put("active", u.isActive());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUser(@PathVariable Long userId) {
        AppUser user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> m = new HashMap<>();
        m.put("id", user.getId());
        m.put("email", user.getEmail());
        m.put("fullName", user.getFullName());
        m.put("role", user.getRole().name());
        m.put("emailVerified", user.isEmailVerified());
        m.put("active", user.isActive());
        return ResponseEntity.ok(m);
    }

    @GetMapping("/users/{userId}/levels")
    public ResponseEntity<?> getUserLevels(@PathVariable Long userId) {
        List<DeveloperLevel> levels = levelRepo.findByDeveloperId(userId);
        List<Map<String, Object>> result = levels.stream().map(l -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", l.getId());
            m.put("componentId", l.getComponent().getId());
            m.put("componentName", l.getComponent().getName());
            m.put("techStack", l.getComponent().getTechStack());
            m.put("projectName", l.getComponent().getProject().getName());
            m.put("currentLevel", l.getCurrentLevel());
            m.put("lastLevelUpAt", l.getLastLevelUpAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{userId}/attempts")
    public ResponseEntity<?> getUserAttempts(@PathVariable Long userId) {
        List<AssessmentAttempt> attempts = attemptRepo.findByDeveloperIdOrderByStartedAtDesc(userId);
        List<Map<String, Object>> result = attempts.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("assessmentId", a.getAssessment().getId());
            m.put("componentName", a.getAssessment().getComponent().getName());
            m.put("techStack", a.getAssessment().getComponent().getTechStack());
            m.put("level", a.getAssessment().getLevel());
            m.put("score", a.getScore());
            m.put("totalQuestions", a.getTotalQuestions());
            m.put("status", a.getStatus().name());
            m.put("passed", a.isPassed());
            m.put("startedAt", a.getStartedAt());
            m.put("completedAt", a.getCompletedAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{userId}/invites")
    public ResponseEntity<?> getUserInvites(@PathVariable Long userId) {
        List<AssessmentInvite> invites = inviteRepo.findByDeveloperIdAndStatus(userId, AssessmentInvite.InviteStatus.PENDING);
        List<Map<String, Object>> result = invites.stream().map(i -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", i.getId());
            m.put("assessmentId", i.getAssessment().getId());
            m.put("componentName", i.getAssessment().getComponent().getName());
            m.put("techStack", i.getAssessment().getComponent().getTechStack());
            m.put("level", i.getAssessment().getLevel());
            m.put("status", i.getStatus().name());
            m.put("createdAt", i.getCreatedAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/assessments")
    public ResponseEntity<?> getAssessments() {
        List<Assessment> assessments = assessmentRepo.findAll();
        List<Map<String, Object>> result = assessments.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("componentId", a.getComponent().getId());
            m.put("componentName", a.getComponent().getName());
            m.put("techStack", a.getComponent().getTechStack());
            m.put("level", a.getLevel());
            m.put("passMarkPercentage", a.getPassMarkPercentage());
            m.put("numberOfQuestions", a.getNumberOfQuestions());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/assessments/pending-review")
    public ResponseEntity<?> getPendingReviews() {
        List<AssessmentAttempt> attempts = attemptRepo.findByStatus(AssessmentAttempt.AttemptStatus.PENDING_REVIEW);
        List<Map<String, Object>> result = attempts.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("developerName", a.getDeveloper().getFullName());
            m.put("developerEmail", a.getDeveloper().getEmail());
            m.put("componentName", a.getAssessment().getComponent().getName());
            m.put("level", a.getAssessment().getLevel());
            m.put("score", a.getScore());
            m.put("totalQuestions", a.getTotalQuestions());
            m.put("startedAt", a.getStartedAt());

            List<Map<String, Object>> answersList = a.getAnswers().stream()
                    .filter(ans -> !ans.isReviewed())
                    .map(ans -> {
                        Map<String, Object> am = new HashMap<>();
                        am.put("id", ans.getId());
                        am.put("questionText", ans.getQuestion().getQuestionText());
                        am.put("givenAnswer", ans.getGivenAnswer());
                        am.put("correctAnswer", ans.getQuestion().getCorrectAnswer());
                        return am;
                    }).collect(Collectors.toList());
            m.put("unreviewedAnswers", answersList);
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/dashboard/admin")
    public ResponseEntity<?> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        List<AppUser> developers = userRepo.findByRole(AppUser.Role.DEVELOPER);
        dashboard.put("totalDevelopers", developers.size());
        dashboard.put("totalTeams", teamRepo.count());
        dashboard.put("totalProjects", projectRepo.count());
        dashboard.put("totalAssessments", assessmentRepo.count());
        dashboard.put("pendingReviews", attemptRepo.findByStatus(AssessmentAttempt.AttemptStatus.PENDING_REVIEW).size());

        List<Map<String, Object>> teamRatings = new ArrayList<>();
        for (Team team : teamRepo.findAll()) {
            Map<String, Object> tr = new HashMap<>();
            tr.put("teamName", team.getName());
            tr.put("teamId", team.getId());

            List<Map<String, Object>> devRatings = new ArrayList<>();
            for (AppUser dev : developers) {
                List<DeveloperLevel> levels = levelRepo.findByDeveloperId(dev.getId());
                if (!levels.isEmpty()) {
                    Map<String, Object> dr = new HashMap<>();
                    dr.put("developerId", dev.getId());
                    dr.put("developerName", dev.getFullName());
                    dr.put("email", dev.getEmail());
                    double avgLevel = levels.stream().mapToInt(DeveloperLevel::getCurrentLevel).average().orElse(0);
                    dr.put("averageLevel", Math.round(avgLevel * 10.0) / 10.0);
                    dr.put("skills", levels.stream().map(l -> {
                        Map<String, Object> s = new HashMap<>();
                        s.put("component", l.getComponent().getName());
                        s.put("techStack", l.getComponent().getTechStack());
                        s.put("level", l.getCurrentLevel());
                        return s;
                    }).collect(Collectors.toList()));
                    devRatings.add(dr);
                }
            }
            tr.put("developers", devRatings);
            teamRatings.add(tr);
        }
        dashboard.put("teamRatings", teamRatings);

        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/dashboard/developer/{userId}")
    public ResponseEntity<?> getDeveloperDashboard(@PathVariable Long userId) {
        AppUser user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("user", Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        ));

        List<DeveloperLevel> levels = levelRepo.findByDeveloperId(userId);
        dashboard.put("skillLevels", levels.stream().map(l -> {
            Map<String, Object> m = new HashMap<>();
            m.put("componentId", l.getComponent().getId());
            m.put("componentName", l.getComponent().getName());
            m.put("techStack", l.getComponent().getTechStack());
            m.put("projectName", l.getComponent().getProject().getName());
            m.put("currentLevel", l.getCurrentLevel());
            m.put("lastLevelUpAt", l.getLastLevelUpAt());
            return m;
        }).collect(Collectors.toList()));

        List<AssessmentInvite> pendingInvites = inviteRepo.findByDeveloperIdAndStatus(userId, AssessmentInvite.InviteStatus.PENDING);
        dashboard.put("pendingInvites", pendingInvites.stream().map(i -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", i.getId());
            m.put("componentName", i.getAssessment().getComponent().getName());
            m.put("techStack", i.getAssessment().getComponent().getTechStack());
            m.put("level", i.getAssessment().getLevel());
            m.put("createdAt", i.getCreatedAt());
            return m;
        }).collect(Collectors.toList()));

        List<AssessmentAttempt> attempts = attemptRepo.findByDeveloperIdOrderByStartedAtDesc(userId);
        dashboard.put("attemptHistory", attempts.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("componentName", a.getAssessment().getComponent().getName());
            m.put("techStack", a.getAssessment().getComponent().getTechStack());
            m.put("level", a.getAssessment().getLevel());
            m.put("score", a.getScore());
            m.put("totalQuestions", a.getTotalQuestions());
            m.put("passed", a.isPassed());
            m.put("status", a.getStatus().name());
            m.put("startedAt", a.getStartedAt());
            m.put("completedAt", a.getCompletedAt());
            return m;
        }).collect(Collectors.toList()));

        List<Map<String, Object>> timeline = new ArrayList<>();
        for (DeveloperLevel level : levels) {
            List<AssessmentAttempt> compAttempts = attempts.stream()
                    .filter(a -> a.getAssessment().getComponent().getId().equals(level.getComponent().getId()) && a.isPassed())
                    .collect(Collectors.toList());
            for (AssessmentAttempt a : compAttempts) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("componentName", level.getComponent().getName());
                entry.put("techStack", level.getComponent().getTechStack());
                entry.put("levelReached", a.getAssessment().getLevel());
                entry.put("date", a.getCompletedAt());
                entry.put("score", a.getScore());
                entry.put("totalQuestions", a.getTotalQuestions());
                timeline.add(entry);
            }
        }
        timeline.sort((a, b) -> {
            LocalDateTime da = (LocalDateTime) a.get("date");
            LocalDateTime db = (LocalDateTime) b.get("date");
            if (da == null && db == null) return 0;
            if (da == null) return 1;
            if (db == null) return -1;
            return da.compareTo(db);
        });
        dashboard.put("trajectoryTimeline", timeline);

        return ResponseEntity.ok(dashboard);
    }
}
