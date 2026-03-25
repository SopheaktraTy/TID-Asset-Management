package com.tid.asset_management_bridge.auth_module.mapper;

import com.tid.asset_management_bridge.auth_module.dto.ProfileResponse;
import com.tid.asset_management_bridge.auth_module.dto.UpdateProfileRequest;
import com.tid.asset_management_bridge.auth_module.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    ProfileResponse toProfileResponse(User user);

    void updateProfile(UpdateProfileRequest request, @MappingTarget User user);

    default java.util.Map<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> mapPermissions(java.util.List<com.tid.asset_management_bridge.auth_module.entity.CustomPermission> permissions) {
        if (permissions == null) {
            return new java.util.HashMap<>();
        }
        return permissions.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        com.tid.asset_management_bridge.auth_module.entity.CustomPermission::getModule,
                        java.util.stream.Collectors.mapping(com.tid.asset_management_bridge.auth_module.entity.CustomPermission::getPermission, java.util.stream.Collectors.toList())
                ));
    }
}
