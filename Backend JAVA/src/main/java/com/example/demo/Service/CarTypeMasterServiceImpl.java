package com.example.demo.Service;

import com.example.demo.Entity.CarTypeMaster;
import com.example.demo.Repository.CarTypeMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarTypeMasterServiceImpl
        implements CarTypeMasterService {

    @Autowired
    private CarTypeMasterRepository carTypeMasterRepository;

    @Override
    public List<CarTypeMaster> getAllCarTypes() {
        return carTypeMasterRepository.findAll();
    }
}

