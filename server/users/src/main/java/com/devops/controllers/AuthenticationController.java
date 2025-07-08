package com.devops.controllers;

import com.devops.entities.users.User;
import com.devops.entities.users.UserRole;
import com.devops.entities.users.dtos.UserId;
import com.devops.infra.security.TokenService;
import com.devops.repositories.UserRepository;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping(produces = { "application/json" })
public class AuthenticationController {

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

    @Value("${vars.mode}")
    private String mode;

    @Value("${vars.host}")
    private String host;

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

    private MultiValueMap<String, String> createParams(String clientId, String clientSecret, String redirectUri,
            String code) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("code", code);
        params.add("redirect_uri", redirectUri);

        return params;
    }

    private String fetchUserToken(Map userInfo) {
        String githubId = String.valueOf(userInfo.get("id"));
        String name = (String) userInfo.getOrDefault("name", userInfo.get("login"));
        String email = (String) userInfo.get("email");

        // Persist user based on GitHub ID
        User user = userRepository.findById(githubId).orElseGet(() -> {
            User newUser = new User();
            newUser.setId(githubId); // GitHub ID becomes primary key
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setPassword(null); // No password — GitHub only
            newUser.setRole(UserRole.USER);
            return userRepository.save(newUser);
        });
        return tokenService.generateToken(user);
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam String code) {
        System.out.println("GitHub reached out to the callback!");
        // 1. Exchange code for access token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> params = createParams(clientId, clientSecret, redirectUri, code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://github.com/login/oauth/access_token",
                request,
                Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            System.out.println("Failed to get access token from GitHub");
            return ResponseEntity.status(401).build();
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
            System.out.println("Failed to get user info from GitHub");
            return ResponseEntity.status(401).build();
        }

        Map userInfo = userResponse.getBody();
        String jwt = fetchUserToken(userInfo);

        // 3. Redirect to frontend with token
        String redirectUrl = "http://" + host + "/ui/v1/callback?token=" + jwt;
        HttpHeaders redirectHeaders = new HttpHeaders();
        redirectHeaders.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND); // 302 Redirect
    }

    @GetMapping("/auth")
    public ResponseEntity<Object> validateToken(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (mode.equalsIgnoreCase("dev")) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("X-User-Id", "dev-user-id");
            return new ResponseEntity<>(headers, HttpStatus.OK);
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String userId = tokenService.validateToken(token);

        if (userId.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-User-Id", userId);
        return new ResponseEntity<>(headers, HttpStatus.OK);
    }

    /**
     * An endpoint to prevent abusing the other endpoints for token checking
     * 
     * @param subject A Header value being set by the proxy after successful
     *                validation of the JWT
     * @return that same header value
     */
    @GetMapping("/whoami")
    public ResponseEntity<UserId> whoAmI(@RequestHeader(value = "X-User-Id", required = false) String subject) {

        UserId id = new UserId(subject);

        if (mode.equalsIgnoreCase("dev")) {
            String realSubject = Optional.ofNullable(subject).orElse("dev-user");
            id = new UserId(realSubject);
        }

        return ResponseEntity.ok(id);
    }
}
