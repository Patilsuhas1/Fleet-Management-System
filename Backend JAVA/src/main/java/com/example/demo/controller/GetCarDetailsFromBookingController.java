package com.example.demo.controller;

import com.example.demo.dto.BookingDTO;
import com.example.demo.Repository.projection.ReturnCarMasterDetailsFromBooking;
import com.example.demo.Service.GetDetailsOfCarFromBookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GetCarDetailsFromBookingController {

    @Autowired
    private GetDetailsOfCarFromBookingService getDetailsOfCarFromBookingService;

    @PostMapping("/getCarByBookingDetails")
            public List<ReturnCarMasterDetailsFromBooking> getCarDetailsByBookingController(@RequestBody  BookingDTO bookingDTO) {

        String bookcar = bookingDTO.getBookcar();

         List<ReturnCarMasterDetailsFromBooking> showData = getDetailsOfCarFromBookingService.serviceOfGetCarDetailsFromBooking(bookingDTO);
         System.out.println("Message Show Data" +showData);
        return showData;




            }
}

