package com.tid.asset_management_bridge.auth_module.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expirationTime;

    @Value("${jwt.expiration-remember-me}")
    private Long expirationTimeRememberMe;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Returns the subject — which is now the userId
    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String subject = extractUserId(token);
        if (userDetails instanceof CustomUserDetails customUserDetails) {
            String userId = customUserDetails.getUser().getId().toString();
            return subject.equals(userId) && !isTokenExpired(token);
        }
        return false;
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(userDetails, false);
    }

    public String generateToken(UserDetails userDetails, boolean rememberMe) {
        if (!(userDetails instanceof CustomUserDetails customUserDetails)) {
            throw new IllegalArgumentException("UserDetails must be an instance of CustomUserDetails");
        }
        String userId = customUserDetails.getUser().getId().toString();
        long expiration = rememberMe ? expirationTimeRememberMe : expirationTime;
        return createToken(userId, expiration);
    }

    private String createToken(String subject, Long expiration) {
        return Jwts.builder()
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }
}
