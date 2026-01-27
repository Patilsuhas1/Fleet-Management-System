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

    public String verifyGoogleTokenAndGetJwt(String accessToken) throws IOException {
        // Use access token to fetch user info from Google
        com.google.api.client.http.GenericUrl url = new com.google.api.client.http.GenericUrl(
                "https://www.googleapis.com/oauth2/v3/userinfo");
        com.google.api.client.http.HttpRequestFactory requestFactory = new NetHttpTransport().createRequestFactory();
        com.google.api.client.http.HttpRequest request = requestFactory.buildGetRequest(url);
        request.getHeaders().setAuthorization("Bearer " + accessToken);

        com.google.api.client.http.HttpResponse response = request.execute();
        java.io.InputStream content = response.getContent();
        com.google.gson.JsonObject payload = com.google.gson.JsonParser
                .parseReader(new java.io.InputStreamReader(content)).getAsJsonObject();

        if (payload != null && payload.has("email")) {
            String email = payload.get("email").getAsString();
            String name = payload.has("name") ? payload.get("name").getAsString() : "";

            // Generate a username from email
            String username = email.split("@")[0];

            // Check if user exists
            User user = userRepository.findByUsername(username);

            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setUsername(username);
                user.setRole(Role.CUSTOMER);
                user.setPassword(UUID.randomUUID().toString());

                try {
                    userRepository.save(user);
                } catch (Exception e) {
                    user.setUsername(username + "_" + UUID.randomUUID().toString().substring(0, 4));
                    userRepository.save(user);
                }
            }

            return jwtService.generateToken(user.getUsername(), user.getRole().name());
        } else {
            throw new IllegalArgumentException("Invalid access token.");
        }
    }
}
