package com.example.demo.Service;

import com.example.demo.dto.BookingDTO;
import com.example.demo.Repository.GetCarDetailsFromBooking;
import com.example.demo.Repository.projection.ReturnCarMasterDetailsFromBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class GetDetailsOfCarFromBookingService {

    @Autowired
    private GetCarDetailsFromBooking getCarDetailsFromBookingRepoVariable;

    public List<ReturnCarMasterDetailsFromBooking> serviceOfGetCarDetailsFromBooking(BookingDTO bookingDTO) {



        String bookCar = bookingDTO.getBookcar();

        System.out.println("Booked Car is "+bookCar);

        return getCarDetailsFromBookingRepoVariable.GetDetailsOfCarFromBooking(bookCar);


    }
}

