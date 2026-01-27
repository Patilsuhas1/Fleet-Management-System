package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.StateMaster;
import com.example.demo.Service.StateServiceImpl;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class StateController {

	@Autowired
	private StateServiceImpl serviceImpl;
	
	@GetMapping(value = "/State")
	public   ResponseEntity<List<StateMaster>>  State() 
	{

		List<StateMaster> list = serviceImpl.getAllStateMaster();
		if(list == null)
		{
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
		return ResponseEntity.status(HttpStatus.OK).body(list);
	}
}

