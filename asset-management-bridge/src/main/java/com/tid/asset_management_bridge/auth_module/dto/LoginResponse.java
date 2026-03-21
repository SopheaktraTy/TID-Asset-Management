package com.tid.asset_management_bridge.auth_module.dto;

public class LoginResponse {
    private String token;
    private ProfileResponse user;

    public LoginResponse(String token, ProfileResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public ProfileResponse getUser() { return user; }
    public void setUser(ProfileResponse user) { this.user = user; }
}
