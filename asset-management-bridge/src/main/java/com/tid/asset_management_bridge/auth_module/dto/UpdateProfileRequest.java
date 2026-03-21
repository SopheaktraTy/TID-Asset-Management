package com.tid.asset_management_bridge.auth_module.dto;

public class UpdateProfileRequest {
    private String username;
    private String email;
    private String image;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
