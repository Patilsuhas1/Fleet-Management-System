package com.example.demo.controller;

import com.example.demo.Service.AddOnService;
import com.example.demo.Service.ExcelUploadService;
import com.example.demo.dto.AddOnDTO;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AddOnController.class)
@ContextConfiguration(classes = { AddOnController.class })
class AddOnControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // Mock the service used by AddOnController
    @MockBean
    private AddOnService addOnService;

    // Mock security dependency (VERY IMPORTANT)
    @MockBean
    private UserDetailsService userDetailsService;

    // -------------------------
    // TEST 1: Get all addons
    // -------------------------
    @Test
    @WithMockUser(username = "user", roles = { "USER" })
    void getAllAddOns_success() throws Exception {

        Mockito.when(addOnService.getAllAddOns())
                .thenReturn(List.of(new AddOnDTO(), new AddOnDTO()));

        mockMvc.perform(get("/api/v1/addons"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // -------------------------
    // TEST 2: Get addon by id
    // -------------------------
    @Test
    @WithMockUser(username = "user", roles = { "USER" })
    void getAddOnById_success() throws Exception {

        Mockito.when(addOnService.getAddOnById(1))
                .thenReturn(new AddOnDTO());

        mockMvc.perform(get("/api/v1/addons/1"))
                .andExpect(status().isOk());
    }
}
