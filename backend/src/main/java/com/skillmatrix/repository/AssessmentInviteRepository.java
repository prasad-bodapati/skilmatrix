package com.skillmatrix.repository;

import com.skillmatrix.entity.AssessmentInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentInviteRepository extends JpaRepository<AssessmentInvite, Long> {
    List<AssessmentInvite> findByDeveloperId(Long developerId);
    List<AssessmentInvite> findByDeveloperIdAndStatus(Long developerId, AssessmentInvite.InviteStatus status);
}
