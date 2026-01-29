package com.example.demo.Repository;

import com.example.demo.Entity.AddOnMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddOnRepository extends JpaRepository<AddOnMaster, Integer> {
}

