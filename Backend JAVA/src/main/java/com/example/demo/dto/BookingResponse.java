package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingResponse {
    private Long bookingId;
    private String confirmationNumber;
    private String bookingStatus;
    private String customerName;
    private String email;
    private String carName;
    private String numberPlate;
    private String pickupHub;
    private Long pickupHubId; // Added for internal logic
    private String returnHub;
    private Long carTypeId; // Added for filtering
    private LocalDate startDate;
    private LocalDate endDate;
    private Double dailyRate;
    private Double totalAmount; // Optional, if calculated
    private Double totalAddonAmount;
    private java.util.List<String> selectedAddOns;
}
