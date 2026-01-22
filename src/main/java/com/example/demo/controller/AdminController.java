package com.example.demo.controller;

import com.example.demo.Service.ExcelUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Adjust for frontend port
public class AdminController {

    @Autowired
    private ExcelUploadService excelUploadService;

    @PostMapping("/upload-rates")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (excelUploadService == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Service not initialized"));
        }

        String message = "";
        try {
            excelUploadService.saveCarTypes(file);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", message));
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + ". Error: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("message", message));
        }
    }
}
