package com.tid.asset_management_bridge.auth_module.security;

import com.tid.asset_management_bridge.auth_module.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.ArrayList;
import java.util.List;
import com.tid.asset_management_bridge.auth_module.entity.CustomPermission;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    // Converts the RoleEnum and granular CustomPermissions to GrantedAuthorities
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Role
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        // Permissions
        if (user.getPermissions() != null) {
            for (CustomPermission p : user.getPermissions()) {
                String authorityName = p.getPermission().name() + "_" + p.getModule().name();
                authorities.add(new SimpleGrantedAuthority(authorityName));
            }
        }

        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getIsActive() != null ? user.getIsActive() : true;
    }
}
