package com.skillmatrix.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_invites")
public class AssessmentInvite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "developer_id", nullable = false)
    private AppUser developer;

    @ManyToOne
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Enumerated(EnumType.STRING)
    private InviteStatus status = InviteStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    public enum InviteStatus {
        PENDING, ACCEPTED, COMPLETED, EXPIRED
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AppUser getDeveloper() { return developer; }
    public void setDeveloper(AppUser developer) { this.developer = developer; }
    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }
    public InviteStatus getStatus() { return status; }
    public void setStatus(InviteStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
