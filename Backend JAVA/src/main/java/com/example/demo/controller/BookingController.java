package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import com.example.demo.Service.BookingService;
import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.dto.ReturnRequest;
import com.example.demo.dto.HandoverRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long bookingId) {
        BookingResponse booking = bookingService.getBooking(bookingId);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<java.util.List<BookingResponse>> getBookingsByUser(@PathVariable String email) {
        java.util.List<BookingResponse> bookings = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/create")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        BookingResponse booking = bookingService.createBooking(request);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/handover/{bookingId}")
    public ResponseEntity<BookingResponse> handoverCar(@PathVariable Long bookingId) {
        BookingResponse booking = bookingService.handoverCar(bookingId);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/process-handover")
    public ResponseEntity<BookingResponse> processHandover(@RequestBody HandoverRequest request) {
        BookingResponse booking = bookingService.processHandover(request);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/return")
    public ResponseEntity<BookingResponse> returnCar(@RequestBody ReturnRequest request) {
        BookingResponse booking = bookingService.returnCar(request);
        return ResponseEntity.ok(booking);
    }

    // Endpoint removed as per single-integer ID refactor
    /*
     * @GetMapping("/search/{confirmationNumber}")
     * public ResponseEntity<BookingResponse> getBookingByConfirmation(@PathVariable
     * String confirmationNumber) {
     * BookingResponse booking =
     * bookingService.getBookingByConfirmation(confirmationNumber);
     * return ResponseEntity.ok(booking);
     * }
     */

    @PostMapping("/cancel/{bookingId}")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long bookingId) {
        BookingResponse booking = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/modify/{bookingId}")
    public ResponseEntity<BookingResponse> modifyBooking(@PathVariable Long bookingId,
            @RequestBody BookingRequest request) {
        BookingResponse booking = bookingService.modifyBooking(bookingId, request);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/storeDates")
    public String storeBookingDates(@RequestParam String start_date, @RequestParam String end_date,
            @RequestParam int cust_id) {

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime rentalDate = LocalDateTime.parse(start_date, dateTimeFormatter);
        LocalDateTime returnDate = LocalDateTime.parse(end_date, dateTimeFormatter);
        //
        // return
        // initialDateService.storeTempDateandTime(rentalDate,returnDate,cust_id);
        return "success";
    }

}

