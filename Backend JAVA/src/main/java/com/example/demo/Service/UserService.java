package com.example.demo.Service;

import com.example.demo.Entity.User;

public interface UserService {

	User addUser(User user);

	User getUserByUsername(String Username);

	String generateResetToken(String email);

	boolean resetPassword(String token, String newPassword);

}
