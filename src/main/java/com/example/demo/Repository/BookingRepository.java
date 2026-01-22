package com.example.demo.Repository;

import com.example.demo.Entity.BookingHeaderTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<BookingHeaderTable, Long> {
    Optional<BookingHeaderTable> findByConfirmationNumber(String confirmationNumber);
}
