package com.tid.asset_management_bridge.auth_module.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.tid.asset_management_bridge.common.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Skip JWT validation for public auth endpoints.
     * This is critical for /api/auth/refresh — if the access_token cookie is expired,
     * the filter must NOT short-circuit the request before it reaches the controller.
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/api/auth/refresh")
            || path.equals("/api/auth/logout")
            || path.equals("/api/auth/login")
            || path.equals("/api/auth/signup")
            || path.equals("/api/auth/forgot-password")
            || path.equals("/api/auth/reset-password");
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String jwt = null;
        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        } else if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("access_token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        // No token present — let the request pass through;
        // SecurityConfig's authenticationEntryPoint will return 401 if the route is protected.
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String identifier = jwtUtil.extractUsername(jwt);

            if (identifier != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(identifier);

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    // Token present but invalid (e.g. wrong signature)
                    sendUnauthorized(response, "Invalid JWT token");
                    return;
                }
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            sendUnauthorized(response, "JWT token has expired");
            return;
        } catch (io.jsonwebtoken.JwtException e) {
            sendUnauthorized(response, "JWT token is malformed or untrusted");
            return;
        } catch (Exception e) {
            logger.warn("JWT verification failed: " + e.getMessage());
            sendUnauthorized(response, "Authentication error: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Writes a structured 401 JSON ApiResponse directly to the response.
     */
    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        ApiResponse<Void> body = new ApiResponse<>(401, message);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
