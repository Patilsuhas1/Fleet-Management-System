package com.example.demo.controller;

import com.example.demo.Entity.HubMaster;

import com.example.demo.Repository.projection.HubInfoProjection;
import com.example.demo.Service.HubService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
// @RequiredArgsConstructor
@RequestMapping("api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class HubController {

    @Autowired
    private HubService hubService;

    @GetMapping("hub")
    public ResponseEntity<List<HubInfoProjection>> getAllHubListByCityIdAndStateId(@RequestParam String stateName,
            @RequestParam String cityName) {
        String state = stateName;
        String city = cityName;
        List<HubInfoProjection> hubs = hubService.getAllHubByCityIdAndStateId(cityName, stateName);
        return new ResponseEntity<>(hubs, HttpStatus.OK);
    }

    @GetMapping("locations/search")
    public ResponseEntity<List<HubInfoProjection>> searchLocations(@RequestParam String query) {
        List<HubInfoProjection> hubs = hubService.searchHubs(query);
        return new ResponseEntity<>(hubs, HttpStatus.OK);
    }

}
