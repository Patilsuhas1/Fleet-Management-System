package com.example.demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.CityMaster;
import com.example.demo.Repository.CityRepository;

@Service
public class CityServiceImpl implements CityService {

	@Autowired
	private CityRepository cityRepository;
	
	

	@Override
	public List<CityMaster> getCitiesByState(int stateId) {
		// TODO Auto-generated method stub
		 return cityRepository.findByState_StateId(stateId);
	}
}

