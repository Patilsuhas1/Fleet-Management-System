package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;


@Service
public class MyUserDetailsService implements UserDetailsService
{

	@Autowired
	private UserRepository repository;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	
		User user =repository.findByUsername(username);
		if(user == null)
		{
			throw new UsernameNotFoundException("User 404");
		}
		
	
		return new UserPrincipal(user);
	}
	
	
	
	
	
}

