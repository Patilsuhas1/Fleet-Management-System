package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.CityMaster;
import com.example.demo.Service.CityService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CityController {
	
	@Autowired
    private CityService cityService;

    @GetMapping("/city/{stateId}")
    public List<CityMaster> getCitiesByState(@PathVariable int stateId) {
        return cityService.getCitiesByState(stateId);
    }

}

