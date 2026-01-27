package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;

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
	
	

}

