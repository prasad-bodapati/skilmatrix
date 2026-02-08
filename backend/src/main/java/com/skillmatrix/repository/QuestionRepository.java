package com.skillmatrix.repository;

import com.skillmatrix.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByComponentId(Long componentId);
    List<Question> findByComponentIdAndDifficultyLevel(Long componentId, int difficultyLevel);
    List<Question> findByComponentIdAndDifficultyLevelLessThanEqual(Long componentId, int level);
}
