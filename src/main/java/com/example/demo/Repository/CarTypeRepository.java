package com.example.demo.Repository;

import com.example.demo.Entity.CarTypeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarTypeRepository extends JpaRepository<CarTypeMaster, Long> {
    Optional<CarTypeMaster> findByCarTypeName(String carTypeName);
}

