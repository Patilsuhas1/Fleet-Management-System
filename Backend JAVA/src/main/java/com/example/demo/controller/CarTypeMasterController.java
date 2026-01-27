package com.example.demo.controller;

import com.example.demo.Entity.CarTypeMaster;
import com.example.demo.Service.CarTypeMasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class CarTypeMasterController {

    @Autowired
    private CarTypeMasterService carTypeMasterService;

    @GetMapping("/car-types")
    public List<CarTypeMaster> getAllCarTypes() {
        return carTypeMasterService.getAllCarTypes();
    }
}

