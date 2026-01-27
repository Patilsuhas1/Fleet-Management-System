//package com.example.demo.Services;
//
//
//import jakarta.servlet.http.HttpSession;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.Date;
//
//@Service
//
//public class InitialDateService {
//
//    @Autowired
//    HttpSession session;
//    public String storeTempDateandTime(LocalDateTime start_date, LocalDateTime end_date, int cust_id) {
//
//        if(start_date == null || end_date == null) {
//            return "Error : Dates cannot be null";
//
//        }
//        if(end_date.isBefore(start_date)) {
//            return "Return date must be after Booking Date";
//
//        }
//        RentalDetails rentalDetails = new RentalDetails( start_date, end_date);
//
//        session.setAttribute("tempBooking "+cust_id,rentalDetails);
//
//        return "Booking dates successfully stored for "+ cust_id;
//    }
//
//
//
//
//   private static class RentalDetails {
//        private LocalDateTime start_date;
//        private LocalDateTime end_date;
//
//        public RentalDetails(LocalDateTime start_date,LocalDateTime end_date) {
//            this.start_date=start_date;
//            this.end_date=end_date;
//        }
//   }a=
//}
//
//




