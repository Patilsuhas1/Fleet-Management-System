package com.example.demo.Service;

import com.example.demo.Repository.CarRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@Slf4j
public class CarService {

    // Logger initialization
    private static final Logger logger = LoggerFactory.getLogger(CarService.class);

    @Autowired
    private CarRepository carRepository;

    public List<Object[]> getCarsByHubAddress(String hub_address_and_details) {
        List<Object[]> carList = null;
        try {

            logger.info("Fetching car details for hub address: {}", hub_address_and_details);

            carList = carRepository.findCarDetailsByHubAddress(hub_address_and_details);

            if (carList == null || carList.isEmpty()) {
                logger.warn("No cars found for hubAddress: {}", hub_address_and_details);
            } else {

                logger.info("Found {} cars for hubAddress: {}", carList.size(), hub_address_and_details);
            }
        } catch (Exception e) {

            logger.error("Error fetching car details for hubAddress: {}. Error: {}", hub_address_and_details,
                    e.getMessage());

            throw new RuntimeException("Failed to fetch car details from repository", e);
        }
        return carList;
    }

    public List<com.example.demo.Entity.CarMaster> getAvailableCars(int hubId, java.time.LocalDate startDate,
            java.time.LocalDate endDate, Long carTypeId) {
        return carRepository.findAvailableCars(hubId, startDate, endDate, carTypeId);
    }
}
