package com.example.demo.Repository;

import com.example.demo.Entity.BookingHeaderTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingHeaderTable, Long> {
    Optional<BookingHeaderTable> findByConfirmationNumber(String confirmationNumber);

    List<BookingHeaderTable> findByEmailId(String emailId);
}

