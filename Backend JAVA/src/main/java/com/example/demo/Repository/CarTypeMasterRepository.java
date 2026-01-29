package com.example.demo.Repository;

import com.example.demo.Entity.CarTypeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarTypeMasterRepository
                extends JpaRepository<CarTypeMaster, Long> {
        java.util.Optional<CarTypeMaster> findByCarTypeName(String carTypeName);
}
