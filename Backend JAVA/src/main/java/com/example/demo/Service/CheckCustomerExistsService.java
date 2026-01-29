package com.example.demo.Service;

import com.example.demo.dto.BookingDTO;
import com.example.demo.Entity.CustomerMaster;
import com.example.demo.Repository.CheckCustomerExistsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CheckCustomerExistsService {
    @Autowired
    private CheckCustomerExistsRepository checkCustomerExists;

    public String createBooking(BookingDTO bookingDTO) {

        Optional<CustomerMaster> checkCustomerExistsService = checkCustomerExists
                .findByEmailIgnoreCase(bookingDTO.getEmail().trim());

        if (checkCustomerExistsService.isPresent()) {
            CustomerMaster customerMaster = checkCustomerExistsService.get();
            return "You can continue with booking";
        } else {
            return "Please login before booking";
        }

    }
}
