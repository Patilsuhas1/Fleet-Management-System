package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {
    private int customerId;
    private int carId;
    private int pickupHubId;
    private int returnHubId;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Integer> addOnIds;
    private String email;
}

