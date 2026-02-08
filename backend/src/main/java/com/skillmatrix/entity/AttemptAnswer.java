package com.skillmatrix.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "attempt_answers")
public class AttemptAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "attempt_id", nullable = false)
    private AssessmentAttempt attempt;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(length = 2000)
    private String givenAnswer;

    private boolean correct;
    private boolean reviewed;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AssessmentAttempt getAttempt() { return attempt; }
    public void setAttempt(AssessmentAttempt attempt) { this.attempt = attempt; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public String getGivenAnswer() { return givenAnswer; }
    public void setGivenAnswer(String givenAnswer) { this.givenAnswer = givenAnswer; }
    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }
    public boolean isReviewed() { return reviewed; }
    public void setReviewed(boolean reviewed) { this.reviewed = reviewed; }
}
