package com.tid.asset_management_bridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
public class AssetManagementBridgeApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssetManagementBridgeApplication.class, args);
	}

}
