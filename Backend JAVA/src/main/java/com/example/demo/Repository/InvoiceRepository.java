package com.example.demo.Repository;

import com.example.demo.Entity.InvoiceHeaderTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceHeaderTable, Long> {
    // You can add custom query methods here if needed, e.g., finding by booking ID
    InvoiceHeaderTable findByBooking_BookingId(Long bookingId);
}

