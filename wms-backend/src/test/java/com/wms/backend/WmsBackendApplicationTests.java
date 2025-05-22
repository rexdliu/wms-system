// wms-backend/src/main/java/com/wms/system/WmsBackendApplication.java
package com.wms.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class WmsBackendApplicationTests {
    public static void main(String[] args) {
        SpringApplication.run(com.wms.backend.WmsBackendApplicationTests.class, args);
    }
}

@RestController
class TestController {
    @GetMapping("/api/test")
    public String test() {
        return "WMS Backend is running successfully!";
    }
}
