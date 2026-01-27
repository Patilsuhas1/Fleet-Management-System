package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	BCryptPasswordEncoder encoder;

	@Override
	public User addUser(User user) {
		// TODO Auto-generated method stub

		user.setPassword(encoder.encode(user.getPassword()));
		userRepository.save(user);

		return user;
	}

	@Override
	public User getUserByUsername(String Username) {

		return userRepository.findByUsername(Username);
	}

	@Override
	public String generateResetToken(String email) {
		Optional<User> userOpt = userRepository.findByEmail(email);
		if (userOpt.isPresent()) {
			User user = userOpt.get();
			String token = UUID.randomUUID().toString();
			user.setResetToken(token);
			user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
			userRepository.save(user);
			return token;
		}
		return null;
	}

	@Override
	public boolean resetPassword(String token, String newPassword) {
		Optional<User> userOpt = userRepository.findByResetToken(token);
		if (userOpt.isPresent()) {
			User user = userOpt.get();
			if (user.getResetTokenExpiry().isAfter(LocalDateTime.now())) {
				user.setPassword(encoder.encode(newPassword));
				user.setResetToken(null);
				user.setResetTokenExpiry(null);
				userRepository.save(user);
				return true;
			}
		}
		return false;
	}

}
