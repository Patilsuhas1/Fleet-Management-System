package com.example.demo.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Data
public class User {
	public User() {
		super();
	}

	public User(int id, String username, String password, String email) {
		super();
		Id = id;
		this.username = username;
		this.password = password;
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;

	@Column(unique = true)
	private String username;

	@Column(unique = true)
	private String password;

	@Column(unique = true)
	private String email;

	@Column(name = "role")
	private String role; // ENUM: CUSTOMER, STAFF, ADMIN

	@ManyToOne
	@jakarta.persistence.JoinColumn(name = "hub_id")
	private HubMaster hub;
}
