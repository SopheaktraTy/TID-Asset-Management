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
}
