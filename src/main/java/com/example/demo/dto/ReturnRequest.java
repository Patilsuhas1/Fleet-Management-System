package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReturnRequest {
    private Long bookingId;
    private LocalDate returnDate;
    // can add mileage, damage status etc later
}
