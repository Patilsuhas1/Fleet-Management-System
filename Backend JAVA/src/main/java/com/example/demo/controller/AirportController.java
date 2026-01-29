package com.example.demo.controller;

import com.example.demo.Repository.projection.HubInfoProjection;
import com.example.demo.Service.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class AirportController {

    @Autowired
    private AirportService airportService;

    @GetMapping("airport")
    public ResponseEntity<?> getHubByAirportCode(@RequestParam String airportCode) {
        try {
            List<HubInfoProjection> hubList = airportService.getHubByAirport(airportCode);
            return new ResponseEntity<>(hubList, HttpStatus.OK);

        } catch (RuntimeException e) {

            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {

            return new ResponseEntity<>("Unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

