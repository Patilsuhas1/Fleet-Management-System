package com.example.demo.controller;

import com.example.demo.Entity.SupportTicket;
import com.example.demo.Repository.SupportTicketRepository;
import com.example.demo.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/support")
@CrossOrigin(origins = "http://localhost:3000")
public class SupportController {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createTicket(@RequestBody SupportTicket ticket) {
        supportTicketRepository.save(ticket);
        return ResponseEntity.ok(new MessageResponse("Ticket created successfully! We will contact you shortly."));
    }
}

