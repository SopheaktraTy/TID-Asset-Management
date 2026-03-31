package com.tid.asset_management_bridge.auth_module.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class LoginResponse {
    private String token;
    private ProfileResponse user;

    @JsonIgnore
    private String refreshToken;

    @JsonIgnore
    private boolean rememberMe;

    public LoginResponse(String token, ProfileResponse user) {
        this.token = token;
        this.user = user;
    }

    public LoginResponse(String token, ProfileResponse user, String refreshToken, boolean rememberMe) {
        this.token = token;
        this.user = user;
        this.refreshToken = refreshToken;
        this.rememberMe = rememberMe;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public ProfileResponse getUser() { return user; }
    public void setUser(ProfileResponse user) { this.user = user; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public boolean isRememberMe() { return rememberMe; }
    public void setRememberMe(boolean rememberMe) { this.rememberMe = rememberMe; }
}
