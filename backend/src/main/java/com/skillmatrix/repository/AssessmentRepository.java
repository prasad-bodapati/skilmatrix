package com.skillmatrix.repository;

import com.skillmatrix.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByComponentId(Long componentId);
    Optional<Assessment> findByComponentIdAndLevel(Long componentId, int level);
}
