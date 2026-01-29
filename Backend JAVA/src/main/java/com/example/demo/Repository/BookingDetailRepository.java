package com.example.demo.Repository;

import com.example.demo.Entity.BookingDetailTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetailTable, Long> {
    List<BookingDetailTable> findByBooking_BookingId(Long bookingId);
}
