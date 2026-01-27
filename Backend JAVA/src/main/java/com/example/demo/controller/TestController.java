package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;


@RestController
public class TestController {

	@GetMapping("/home")
	public String HomePage(HttpServletRequest request)
	{
		
		return "Home " + request.getSession().getId();
	}
	
	
	
	@GetMapping("/about")
	public String Page(HttpServletRequest request)
	{
		
		return "about" + request.getSession().getId();
	}
}


