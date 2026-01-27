package com.example.demo.Service;

import com.example.demo.Entity.Vendor;
import com.example.demo.Repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorIntegrationService {

    @Autowired
    private VendorRepository vendorRepository;

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor saveVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    // Simulate External API Call
    public String testConnection(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor not found"));

        // Mocking logic: If API URL contains "error", simulate failure.
        if (vendor.getApiUrl() != null && vendor.getApiUrl().contains("error")) {
            throw new RuntimeException("Connection timed out to " + vendor.getApiUrl());
        }

        return "Successfully connected to " + vendor.getName() + " [ Latency: 45ms ]";
    }
}

