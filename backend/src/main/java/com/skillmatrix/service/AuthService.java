package com.skillmatrix.service;

import com.skillmatrix.dto.AuthDtos.*;
import com.skillmatrix.entity.AppUser;
import com.skillmatrix.repository.AppUserRepository;
import com.skillmatrix.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class AuthService {
    private final AppUserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AppUserRepository userRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.email)) {
            throw new RuntimeException("Email already registered");
        }

        AppUser user = new AppUser();
        user.setEmail(req.email);
        user.setFullName(req.fullName);

        if (userRepo.count() == 0) {
            user.setRole(AppUser.Role.ROOT);
        } else {
            user.setRole(AppUser.Role.valueOf(req.role != null ? req.role : "DEVELOPER"));
        }

        String code = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(code);
        user.setEmailVerified(false);
        userRepo.save(user);

        AuthResponse resp = new AuthResponse();
        resp.userId = user.getId();
        resp.email = user.getEmail();
        resp.needsVerification = true;
        resp.role = user.getRole().name();
        return resp;
    }

    public AuthResponse verify(VerifyRequest req) {
        AppUser user = userRepo.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!req.code.equals(user.getVerificationCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        userRepo.save(user);

        AuthResponse resp = new AuthResponse();
        resp.userId = user.getId();
        resp.email = user.getEmail();
        resp.needsPassword = true;
        resp.role = user.getRole().name();
        return resp;
    }

    public AuthResponse setPassword(SetPasswordRequest req) {
        AppUser user = userRepo.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(req.password));
        user.setSecurityQuestion(req.securityQuestion);
        user.setSecurityAnswer(passwordEncoder.encode(req.securityAnswer));
        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        AppUser user = userRepo.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isEmailVerified()) {
            AuthResponse resp = new AuthResponse();
            resp.email = user.getEmail();
            resp.needsVerification = true;
            resp.role = user.getRole().name();
            return resp;
        }

        if (user.getPassword() == null) {
            AuthResponse resp = new AuthResponse();
            resp.email = user.getEmail();
            resp.needsPassword = true;
            resp.role = user.getRole().name();
            return resp;
        }

        if (!passwordEncoder.matches(req.password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
    }

    public String getSecurityQuestion(String email) {
        AppUser user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getSecurityQuestion();
    }

    public AuthResponse resetPassword(ResetPasswordRequest req) {
        AppUser user = userRepo.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.securityAnswer, user.getSecurityAnswer())) {
            throw new RuntimeException("Invalid security answer");
        }

        user.setPassword(passwordEncoder.encode(req.newPassword));
        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
    }

    public AuthResponse inviteUser(InviteUserRequest req) {
        if (userRepo.existsByEmail(req.email)) {
            throw new RuntimeException("User already exists");
        }

        AppUser user = new AppUser();
        user.setEmail(req.email);
        user.setFullName(req.fullName);
        user.setRole(AppUser.Role.valueOf(req.role));

        String code = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(code);
        user.setEmailVerified(false);
        userRepo.save(user);

        AuthResponse resp = new AuthResponse();
        resp.userId = user.getId();
        resp.email = user.getEmail();
        resp.role = user.getRole().name();
        resp.fullName = user.getFullName();
        return resp;
    }
}
