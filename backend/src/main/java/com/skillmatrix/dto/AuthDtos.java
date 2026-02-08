package com.skillmatrix.dto;

public class AuthDtos {
    public static class RegisterRequest {
        public String email;
        public String fullName;
        public String role;
    }

    public static class VerifyRequest {
        public String email;
        public String code;
    }

    public static class SetPasswordRequest {
        public String email;
        public String password;
        public String securityQuestion;
        public String securityAnswer;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class ResetPasswordRequest {
        public String email;
        public String securityAnswer;
        public String newPassword;
    }

    public static class AuthResponse {
        public String token;
        public Long userId;
        public String email;
        public String fullName;
        public String role;
        public boolean needsVerification;
        public boolean needsPassword;

        public AuthResponse() {}

        public AuthResponse(String token, Long userId, String email, String fullName, String role) {
            this.token = token;
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
        }
    }

    public static class InviteUserRequest {
        public String email;
        public String fullName;
        public String role;
        public Long projectId;
    }

    public static class AssessmentInviteRequest {
        public Long developerId;
        public Long assessmentId;
    }

    public static class SubmitAnswerRequest {
        public Long questionId;
        public String answer;
    }

    public static class GradeAnswerRequest {
        public Long answerId;
        public boolean correct;
    }
}
