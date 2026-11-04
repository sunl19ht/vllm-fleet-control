package io.github.sunl19ht.fleetcontrol.common;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
public class SystemController {

    @GetMapping("/info")
    public Map<String, String> info() {
        return Map.of(
                "application", "vllm-fleet-control",
                "stage", "M0"
        );
    }
}
