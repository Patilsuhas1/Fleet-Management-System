package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.CarService;

import java.util.List;

@RestController
@RequestMapping("api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class CarController {
    @Autowired
    private CarService carService;

    @Autowired
    private com.example.demo.Service.ExcelUploadService excelUploadService;

    @org.springframework.web.bind.annotation.PostMapping(value = "/cars/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String message = "";
        try {
            excelUploadService.save(file);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new com.example.demo.dto.MessageResponse(message));
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .body(new com.example.demo.dto.MessageResponse(message));
        }
    }

    @GetMapping("cars")
    public ResponseEntity<List<Object[]>> getCarDetailsByHubAddress(@RequestParam String hubAddress) {
        List<Object[]> cars = carService.getCarsByHubAddress(hubAddress);
        return new ResponseEntity<>(cars, HttpStatus.OK);

    }

    @GetMapping("cars/available")
    public ResponseEntity<List<com.example.demo.Entity.CarMaster>> getAvailableCars(
            @RequestParam int hubId,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        System.out.println(
                "DEBUG: getAvailableCars called with hubId=" + hubId + ", start=" + startDate + ", end=" + endDate);
        java.time.LocalDate start = java.time.LocalDate.parse(startDate);
        java.time.LocalDate end = java.time.LocalDate.parse(endDate);

        List<com.example.demo.Entity.CarMaster> cars = carService.getAvailableCars(hubId, start, end);
        System.out.println("DEBUG: Found " + cars.size() + " cars.");
        return new ResponseEntity<>(cars, HttpStatus.OK);
    }
}

