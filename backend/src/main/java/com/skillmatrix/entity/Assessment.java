package com.skillmatrix.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    @Column(nullable = false)
    private int level;

    private int passMarkPercentage = 70;
    private int numberOfQuestions = 10;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "created_by")
    private AppUser createdBy;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Component getComponent() { return component; }
    public void setComponent(Component component) { this.component = component; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public int getPassMarkPercentage() { return passMarkPercentage; }
    public void setPassMarkPercentage(int passMarkPercentage) { this.passMarkPercentage = passMarkPercentage; }
    public int getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(int numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public AppUser getCreatedBy() { return createdBy; }
    public void setCreatedBy(AppUser createdBy) { this.createdBy = createdBy; }
}
