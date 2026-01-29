package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	User findByUsername(String username);

	java.util.Optional<User> findByEmail(String email);

	java.util.Optional<User> findByResetToken(String resetToken);

	java.util.List<User> findByRole(com.example.demo.Entity.Role role);
}
