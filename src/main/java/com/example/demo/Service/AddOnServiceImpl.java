package com.example.demo.Service;

import com.example.demo.Entity.AddOnMaster;
import com.example.demo.Repository.AddOnRepository;
import com.example.demo.dto.AddOnDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddOnServiceImpl implements AddOnService {

    @Autowired
    private AddOnRepository addOnRepository;

    @Override
    public List<AddOnDTO> getAllAddOns() {
        return addOnRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AddOnDTO getAddOnById(int id) {
        AddOnMaster addOn = addOnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AddOn not found with id: " + id));
        return convertToDTO(addOn);
    }

    private AddOnDTO convertToDTO(AddOnMaster addOn) {
        return new AddOnDTO(
                addOn.getAddOnId(),
                addOn.getAddOnName(),
                addOn.getAddonDailyRate(),
                addOn.getRateValidUntil());
    }
}

