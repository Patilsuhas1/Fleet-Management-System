package com.example.demo.Repository;

import com.example.demo.Entity.CustomerMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CheckCustomerExistsRepository extends JpaRepository<CustomerMaster, Integer> {
    Optional<CustomerMaster> findByEmailIgnoreCase(String email);
}
