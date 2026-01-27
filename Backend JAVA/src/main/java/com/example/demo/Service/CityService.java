package com.example.demo.Service;

import java.util.List;

import com.example.demo.Entity.CityMaster;

public interface CityService {
	
	public List<CityMaster> getCitiesByState(int stateId);
}

