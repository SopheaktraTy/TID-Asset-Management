package com.tid.asset_management_bridge;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGeneratorTest {
    @Test
    public void generateHash() {
        System.out.println("GEN_HASH_START:" + new BCryptPasswordEncoder().encode("btc@001") + ":GEN_HASH_END");
    }
}
