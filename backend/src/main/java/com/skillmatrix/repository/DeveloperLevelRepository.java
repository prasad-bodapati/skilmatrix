package com.skillmatrix.repository;

import com.skillmatrix.entity.DeveloperLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DeveloperLevelRepository extends JpaRepository<DeveloperLevel, Long> {
    List<DeveloperLevel> findByDeveloperId(Long developerId);
    Optional<DeveloperLevel> findByDeveloperIdAndComponentId(Long developerId, Long componentId);
}
