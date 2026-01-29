package com.example.demo.controller;

import com.example.demo.Service.ExcelUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;
import com.example.demo.Service.BookingService;
import com.example.demo.dto.BookingResponse;

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

    @Autowired
    private BookingService bookingService;

    @Autowired
    private com.example.demo.Repository.UserRepository userRepository;

    @Autowired
    private com.example.demo.Repository.HubRepository hubRepository;

    @Autowired
    private com.example.demo.Service.UserService userService;

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PostMapping("/register-staff")
    public ResponseEntity<?> registerStaff(@RequestBody com.example.demo.Entity.User user) {
        try {
            user.setRole(com.example.demo.Entity.Role.STAFF);
            // Use the service to add user which handles password encoding
            userService.addUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Staff registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to register staff: " + e.getMessage()));
        }
    }

    @GetMapping("/staff")
    public ResponseEntity<List<com.example.demo.Entity.User>> getAllStaff() {
        return ResponseEntity.ok(userRepository.findByRole(com.example.demo.Entity.Role.STAFF));
    }

    @GetMapping("/hubs")
    public ResponseEntity<List<com.example.demo.Entity.HubMaster>> getAllHubs() {
        return ResponseEntity.ok(hubRepository.findAll());
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable int id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Staff removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to remove staff"));
        }
    }
}
