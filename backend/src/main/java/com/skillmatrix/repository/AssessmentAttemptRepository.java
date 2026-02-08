package com.skillmatrix.repository;

import com.skillmatrix.entity.AssessmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, Long> {
    List<AssessmentAttempt> findByDeveloperId(Long developerId);
    List<AssessmentAttempt> findByDeveloperIdOrderByStartedAtDesc(Long developerId);
    List<AssessmentAttempt> findByStatus(AssessmentAttempt.AttemptStatus status);
    List<AssessmentAttempt> findByAssessmentId(Long assessmentId);
}
