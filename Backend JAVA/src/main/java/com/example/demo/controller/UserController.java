package com.example.demo.controller;

import java.time.LocalTime;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

import com.example.demo.Entity.User;
import com.example.demo.Service.JwtService;
import com.example.demo.Service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private AuthenticationManager authManager;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private com.example.demo.Repository.CustomerRepository customerRepository;

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody User user) {
		// Enforce CUSTOMER role for public registration
		user.setRole(com.example.demo.Entity.Role.CUSTOMER);
		User user2 = userService.addUser(user);
		if (user2 == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
		return ResponseEntity.status(HttpStatus.CREATED).body(user);
	}

	@PostMapping(value = "/login")
	public ResponseEntity<?> login(@RequestBody User user) {
		try {
			Authentication authentication = authManager.authenticate(
					new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

			if (authentication.isAuthenticated()) {
				logger.info("Signed In Successfully " + user.getUsername());
				String jwt = jwtService.generateToken(user.getUsername());

				// Fetch full user details
				User fullUser = userService.getUserByUsername(user.getUsername());

				Map<String, Object> response = new HashMap<>();
				response.put("token", jwt);
				response.put("role", fullUser.getRole());
				response.put("userId", fullUser.getId());
				response.put("email", fullUser.getEmail());
				response.put("username", fullUser.getUsername());
				if (fullUser.getHub() != null) {
					response.put("hubId", fullUser.getHub().getHubId());
				}

				com.example.demo.Entity.CustomerMaster customer = customerRepository
						.findByEmailIgnoreCase(fullUser.getEmail());
				if (customer != null) {
					response.put("customerId", customer.getCustId());
				} else {
					// Fallback using userId if no customer record found, though this is risky
					response.put("customerId", fullUser.getId());
				}

				return ResponseEntity.ok(response);
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
			}
		} catch (Exception e) {
			logger.error("Sign In Error", e);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Creds");
		}
	}

	@Autowired
	private com.example.demo.Service.GoogleAuthService googleAuthService;

	@PostMapping("/api/v1/auth/google")
	public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
		try {
			String token = request.get("token");
			String jwt = googleAuthService.verifyGoogleTokenAndGetJwt(token);

			// We need to fetch the user again to get the role/id for the response
			// Extract username from jwt or just use the logic from normal login if possible
			// But since we have the JWT, let's decode username from it or have
			// GoogleAuthService return User object?
			// BETTER APPROACH: Let's fetch the user based on the username encoded in the
			// JWT we just got.

			String username = jwtService.extractUserName(jwt);
			User fullUser = userService.getUserByUsername(username);

			Map<String, Object> response = new HashMap<>();
			response.put("token", jwt);
			response.put("role", fullUser.getRole());
			response.put("userId", fullUser.getId());
			response.put("email", fullUser.getEmail());
			response.put("username", fullUser.getUsername());
			if (fullUser.getHub() != null) {
				response.put("hubId", fullUser.getHub().getHubId());
			}

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			logger.error("Google Sign In Error", e);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google Token");
		}
	}

	@Autowired
	private com.example.demo.Service.EmailService emailService;

	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		String token = userService.generateResetToken(email);
		if (token != null) {
			emailService.sendPasswordResetEmail(email, token);
		}
		// Always return OK for security reasons even if email is not found
		return ResponseEntity.ok("If an account exists with this email, you will receive a reset link shortly.");
	}

	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
		String token = request.get("token");
		String newPassword = request.get("password");
		boolean success = userService.resetPassword(token, newPassword);
		if (success) {
			return ResponseEntity.ok("Password has been reset successfully.");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired reset token.");
		}
	}

}
