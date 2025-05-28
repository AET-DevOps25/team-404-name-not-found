package com.devops.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WhoAmIController {

    /**
     * An endpoint to prevent abusing the other endpoints for token checking
     * 
     * @param subject A Header value being set by the proxy after successful
     *                validation of the JWT
     * @return that same header value
     */
    @GetMapping("/whoami")
    public ResponseEntity<?> whoAmI(@RequestHeader("Subject") String subject) {
        return ResponseEntity.ok(subject);
    }
}
