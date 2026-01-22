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

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody User user) {
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
				if (fullUser.getHub() != null) {
					response.put("hubId", fullUser.getHub().getHubId());
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

	// @PostMapping(value = "/login")
	// public ResponseEntity<?> validateUser(@RequestBody User user) {
	//
	// try {
	//
	// boolean success = userService.validateUser(user);
	//
	// if (success) {
	// return ResponseEntity.ok("Login Succesfull");
	// } else {
	// return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user name
	// or password");
	// }
	//
	// } catch (Exception e) {
	//
	// return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some Error
	// Occurred" + e.getMessage());
	//
	// }
	//
	// }

}
