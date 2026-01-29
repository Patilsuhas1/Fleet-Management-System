package com.example.demo.controller;

import com.example.demo.Entity.Vendor;
import com.example.demo.Service.VendorIntegrationService;
import com.example.demo.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vendors")
@CrossOrigin(origins = "http://localhost:3000")
public class VendorController {

    @Autowired
    private VendorIntegrationService vendorService;

    @GetMapping
    public List<Vendor> getAllVendors() {
        return vendorService.getAllVendors();
    }

    @PostMapping
    public ResponseEntity<?> addVendor(@RequestBody Vendor vendor) {
        vendorService.saveVendor(vendor);
        return ResponseEntity.ok(new MessageResponse("Vendor added successfully!"));
    }

    @PostMapping("/{id}/test-connection")
    public ResponseEntity<?> testConnection(@PathVariable Long id) {
        try {
            String result = vendorService.testConnection(id);
            return ResponseEntity.ok(new MessageResponse(result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Connection Failed: " + e.getMessage()));
        }
    }
}

