package com.example.demo.Service;

import com.example.demo.Entity.User;
import com.example.demo.Entity.Role;
import com.example.demo.Repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;

@Service
public class GoogleAuthService {

    @Value("${google.client.id}")
    private String clientId;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public String verifyGoogleTokenAndGetJwt(String tokenHtml) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();

        GoogleIdToken idToken = verifier.verify(tokenHtml);
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String givenName = (String) payload.get("given_name");

            // Generate a username from email if name is missing or for uniqueness
            String username = email.split("@")[0];

            // Check if user exists
            User user = userRepository.findByUsername(username);

            // If try by email (if your logic allows, but here we strictly follow User
            // entity which uses username)
            // Ideally we should check by email too if your User entity has email query
            if (user == null) {
                // Try to find by email if possible or create new
                // Since User has unique username, let's create one
                user = new User();
                user.setEmail(email);
                user.setUsername(username);
                user.setRole(Role.CUSTOMER);
                // Set a random password as they use Google to login
                user.setPassword(UUID.randomUUID().toString());

                try {
                    userRepository.save(user);
                } catch (Exception e) {
                    // Fallback if username taken
                    user.setUsername(username + "_" + UUID.randomUUID().toString().substring(0, 4));
                    userRepository.save(user);
                }
            }

            // Generate our own JWT
            return jwtService.generateToken(user.getUsername(), user.getRole().name());
        } else {
            throw new IllegalArgumentException("Invalid ID token.");
        }
    }
}

