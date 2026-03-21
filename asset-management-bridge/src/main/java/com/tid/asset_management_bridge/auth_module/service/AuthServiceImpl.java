package com.tid.asset_management_bridge.auth_module.service;

import com.tid.asset_management_bridge.auth_module.dto.*;
import com.tid.asset_management_bridge.auth_module.entity.User;
import com.tid.asset_management_bridge.auth_module.mapper.UserMapper;
import com.tid.asset_management_bridge.auth_module.repository.UserRepository;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import com.tid.asset_management_bridge.common.exception.ConflictException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.tid.asset_management_bridge.auth_module.security.JwtUtil;
import com.tid.asset_management_bridge.auth_module.security.CustomUserDetailsService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, 
                           UserMapper userMapper,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil,
                           CustomUserDetailsService userDetailsService,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // Authenticate via Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        // Fetch UserDetails
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getIdentifier());

        // Generate JWT
        String token = jwtUtil.generateToken(userDetails);

        // Fetch User returning profile info matching identifier 
        User user = userRepository.findByUsernameOrEmail(request.getIdentifier(), request.getIdentifier())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new LoginResponse(token, userMapper.toProfileResponse(user));
    }

    @Override
    @Transactional
    public ProfileResponse register(@NonNull RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ConflictException("Username is already taken");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);
        
        return userMapper.toProfileResponse(userRepository.save(user));
    }

    @Override
    public void logout(String token) {
        // Implementation requires token invalidation logic (Next steps)
        throw new UnsupportedOperationException("Logout implementation pending.");
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        // Implementation requires JwtUtil to validate and issue new token (Next steps)
        throw new UnsupportedOperationException("Refresh Token implementation pending.");
    }

    @Override
    public void forgotPassword(String identifier) {
        // Requires email generation service
        throw new UnsupportedOperationException("Forgot password implementation pending.");
    }

    @Override
    @Transactional
    public void changePassword(@NonNull Long userId, ChangePasswordRequest request) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        // Need to verify currentPassword via PasswordEncoder, then set newPassword. (Next steps)
        throw new UnsupportedOperationException("Password changing implementation pending.");
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public ProfileResponse updateProfile(@NonNull Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Uniqueness check for email/username updates
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new ConflictException("Username is already taken");
            }
        }
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ConflictException("Email is already registered");
            }
        }

        userMapper.updateProfile(request, user);
        User updatedUser = userRepository.save(user);
        return userMapper.toProfileResponse(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse viewProfile(@NonNull Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return userMapper.toProfileResponse(user);
    }
}
