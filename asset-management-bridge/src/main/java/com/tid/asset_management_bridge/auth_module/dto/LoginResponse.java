package com.tid.asset_management_bridge.auth_module.dto;
 
import com.fasterxml.jackson.annotation.JsonIgnore;
 
public class LoginResponse {
    private String token;
    private Long userId;

    @JsonIgnore
    private String refreshToken;

    @JsonIgnore
    private boolean rememberMe;

    public LoginResponse(String token, Long userId) {
        this.token = token;
        this.userId = userId;
    }

    public LoginResponse(String token, Long userId, String refreshToken, boolean rememberMe) {
        this.token = token;
        this.userId = userId;
        this.refreshToken = refreshToken;
        this.rememberMe = rememberMe;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public boolean isRememberMe() { return rememberMe; }
    public void setRememberMe(boolean rememberMe) { this.rememberMe = rememberMe; }
}
