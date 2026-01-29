package com.example.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.StateMaster;
import com.example.demo.Repository.StateRepository;

@Service
public class StateServiceImpl implements StateService {
	
	@Autowired
	private StateRepository stateRepository;

	@Override
	public List<StateMaster> getAllStateMaster() {
		// TODO Auto-generated method 
		
		return stateRepository.findAll();
	}

	
	

}

