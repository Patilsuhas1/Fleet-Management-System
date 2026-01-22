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
    private String returnHub;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double dailyRate;
    private Double totalAmount; // Optional, if calculated
}
