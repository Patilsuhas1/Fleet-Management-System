package com.example.demo.Service;

import com.example.demo.dto.AddOnDTO;
import java.util.List;

public interface AddOnService {
    List<AddOnDTO> getAllAddOns();

    AddOnDTO getAddOnById(int id);
}
