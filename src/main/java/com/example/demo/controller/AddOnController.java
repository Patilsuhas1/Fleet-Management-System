package com.example.demo.controller;

import com.example.demo.Service.AddOnService;
import com.example.demo.dto.AddOnDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class AddOnController {

    @Autowired
    private AddOnService addOnService;

    @GetMapping("addons")
    public ResponseEntity<?> getAllAddOns() {
        try {
            List<AddOnDTO> addOns = addOnService.getAllAddOns();
            return new ResponseEntity<>(addOns, HttpStatus.OK);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error occurred",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("addons/{id}")
    public ResponseEntity<?> getAddOnById(@PathVariable int id) {
        try {
            AddOnDTO addOn = addOnService.getAddOnById(id);
            return new ResponseEntity<>(addOn, HttpStatus.OK);

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error occurred",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
