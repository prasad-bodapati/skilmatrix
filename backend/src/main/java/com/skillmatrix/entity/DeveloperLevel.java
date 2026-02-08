package com.skillmatrix.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "developer_levels")
public class DeveloperLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "developer_id", nullable = false)
    private AppUser developer;

    @ManyToOne
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    private int currentLevel = 0;
    private LocalDateTime lastLevelUpAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AppUser getDeveloper() { return developer; }
    public void setDeveloper(AppUser developer) { this.developer = developer; }
    public Component getComponent() { return component; }
    public void setComponent(Component component) { this.component = component; }
    public int getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(int currentLevel) { this.currentLevel = currentLevel; }
    public LocalDateTime getLastLevelUpAt() { return lastLevelUpAt; }
    public void setLastLevelUpAt(LocalDateTime lastLevelUpAt) { this.lastLevelUpAt = lastLevelUpAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
