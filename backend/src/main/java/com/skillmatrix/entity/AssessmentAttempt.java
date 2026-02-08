package com.skillmatrix.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessment_attempts")
public class AssessmentAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "developer_id", nullable = false)
    private AppUser developer;

    @ManyToOne
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    private int score;
    private int totalQuestions;

    @Enumerated(EnumType.STRING)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    private boolean passed;
    private LocalDateTime startedAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL)
    private List<AttemptAnswer> answers = new ArrayList<>();

    public enum AttemptStatus {
        IN_PROGRESS, COMPLETED, PENDING_REVIEW, GRADED
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AppUser getDeveloper() { return developer; }
    public void setDeveloper(AppUser developer) { this.developer = developer; }
    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public AttemptStatus getStatus() { return status; }
    public void setStatus(AttemptStatus status) { this.status = status; }
    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public List<AttemptAnswer> getAnswers() { return answers; }
    public void setAnswers(List<AttemptAnswer> answers) { this.answers = answers; }
}
