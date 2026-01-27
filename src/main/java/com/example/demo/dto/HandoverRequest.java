package com.example.demo.dto;

import lombok.Data;

@Data
public class HandoverRequest {
    private Long bookingId;
    private Integer carId;
    private String fuelStatus; // "1/4", "1/2", "3/4", "Full"
    private String notes;
}

