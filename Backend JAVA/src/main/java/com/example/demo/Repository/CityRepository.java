package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.CityMaster;

public interface CityRepository extends JpaRepository<CityMaster, Integer> {
    List<CityMaster> findByState_StateId(Integer stateId);
}

