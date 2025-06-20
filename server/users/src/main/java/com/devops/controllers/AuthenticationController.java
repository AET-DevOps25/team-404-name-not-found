package com.devops.controllers;

import com.devops.entities.users.dtos.AuthenticationDTO;
import com.devops.entities.users.dtos.LoginResponseDTO;
import com.devops.entities.users.dtos.RegisterDTO;
import com.devops.entities.users.User;
import com.devops.infra.security.TokenService;
import com.devops.repositories.UserRepository;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping(value = "/users", produces = { "application/json" })
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;

    @Value("${github.client-id}")
    private String clientId;

    @Value("${github.client-secret}")
    private String clientSecret;

    @Value("${github.redirect-uri}")
    private String redirectUri;

    /**
     * Forwards login requests to github
     * 
     * @param None
     * @return A redirect to GitHub
     */
    @GetMapping("/login")
    public ResponseEntity<Void> login() {
        System.err.println("Login Endpoint Called!");
        String redirectUriSafe = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String githubAuthUrl = "https://github.com/login/oauth/authorize"
                + "?client_id=" + clientId
                + "&redirect_uri=" + redirectUriSafe;

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(githubAuthUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND); // HTTP 302
    }

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/callback")
    public ResponseEntity<?> callback(@RequestParam String code) {
        System.out.println("GitHub reached out to the callback!");
        // 1. Exchange code for access token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("code", code);
        params.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://github.com/login/oauth/access_token",
                request,
                Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(401).body("Failed to get access token from GitHub");
        }

        System.out.println("Here is the response to the query for the access token: " + response.getBody());
        String accessToken = (String) response.getBody().get("access_token");

        // 2. Use access token to get user info
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(accessToken);
        HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

        ResponseEntity<Map> userResponse = restTemplate.exchange(
                "https://api.github.com/user",
                HttpMethod.GET,
                userRequest,
                Map.class);

        if (!userResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(401).body("Failed to get user info from GitHub");
        }

        Map userInfo = userResponse.getBody();

        // 3. Return user info for now
        return ResponseEntity.ok(userInfo);
    }

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
