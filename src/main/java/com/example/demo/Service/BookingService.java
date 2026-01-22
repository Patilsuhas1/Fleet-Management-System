package com.example.demo.Service;

import com.example.demo.Entity.*;
import com.example.demo.Repository.*;
import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.dto.ReturnRequest;
import com.example.demo.dto.HandoverRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.UUID;
import java.util.Optional;

@Service
public class BookingService {

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private CarRepository carRepository;

        @Autowired
        private CustomerRepository customerRepository;

        @Autowired
        private HubRepository hubRepository;

        @Autowired
        private InvoiceRepository invoiceRepository;

        public BookingResponse createBooking(BookingRequest request) {
                BookingHeaderTable booking = new BookingHeaderTable();

                // Load Entities
                CarMaster car = carRepository.findById(request.getCarId())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid Car ID"));
                CustomerMaster customer = customerRepository.findById(request.getCustomerId())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid Customer ID"));
                HubMaster pickupHub = hubRepository.findById(request.getPickupHubId())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid Pickup Hub ID"));
                HubMaster returnHub = hubRepository.findById(request.getReturnHubId())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid Return Hub ID"));

                // Set Fields
                booking.setCustomer(customer);
                booking.setCar(car);
                booking.setCarType(car.getCarType()); // Set Car Type
                booking.setPickupHub(pickupHub);
                booking.setReturnHub(returnHub);
                booking.setStartDate(request.getStartDate());
                booking.setEndDate(request.getEndDate());
                booking.setBookingDate(LocalDate.now());

                // Generate Confirmation Number
                booking.setConfirmationNumber("BOK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                booking.setBookingStatus("CONFIRMED");

                // Copy redundant fields (for invoice/history)
                booking.setFirstName(customer.getFirstName());
                booking.setLastName(customer.getLastName());
                booking.setAddress(customer.getAddressLine1());

                // Fix for missing Address details
                booking.setPin(customer.getPincode());
                booking.setState(customer.getCity()); // Assuming Customer City as proxy for State if State not in
                                                      // Customer, or leave blank if strictly State

                booking.setEmailId(request.getEmail());
                booking.setBookcar(car.getCarName());

                // Fix for missing Rates
                if (car.getCarType() != null) {
                        booking.setDailyRate(car.getCarType().getDailyRate());
                        booking.setWeeklyRate(car.getCarType().getWeeklyRate());
                        booking.setMonthlyRate(car.getCarType().getMonthlyRate());
                }

                BookingHeaderTable savedBooking = bookingRepository.save(booking);
                return mapToResponse(savedBooking);
        }

        public BookingResponse handoverCar(Long bookingId) {
                // Deprecated: delegated to new method with nulls
                HandoverRequest req = new HandoverRequest();
                req.setBookingId(bookingId);
                return processHandover(req);
        }

        public BookingResponse processHandover(HandoverRequest request) {
                BookingHeaderTable booking = bookingRepository.findById(request.getBookingId())
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                if (!"CONFIRMED".equalsIgnoreCase(booking.getBookingStatus())) {
                        throw new RuntimeException("Booking is not in CONFIRMED state");
                }

                // Handle Car Selection/Swap
                if (request.getCarId() != null) {
                        CarMaster currentCar = booking.getCar();
                        // If switching car
                        if (currentCar == null || currentCar.getCarId() != request.getCarId()) {
                                CarMaster newCar = carRepository.findById(request.getCarId())
                                                .orElseThrow(() -> new IllegalArgumentException("Invalid Car ID"));

                                if (newCar.getIsAvailable() != CarMaster.AvailabilityStatus.Y) {
                                        throw new RuntimeException("Selected car is not available");
                                }

                                // Release old car if exists
                                if (currentCar != null) {
                                        currentCar.setIsAvailable(CarMaster.AvailabilityStatus.Y);
                                        carRepository.save(currentCar);
                                }

                                // Assign new car
                                booking.setCar(newCar);
                                booking.setBookcar(newCar.getCarName());
                                // Update availability immediately to prevent race conditions (simple approach)
                                newCar.setIsAvailable(CarMaster.AvailabilityStatus.N);
                                carRepository.save(newCar);
                        }
                } else {
                        // Mark existing car as unavailable if not already
                        CarMaster car = booking.getCar();
                        if (car != null) {
                                car.setIsAvailable(CarMaster.AvailabilityStatus.N);
                                carRepository.save(car);
                        }
                }

                // Capture Handover Details
                booking.setPickupTime(java.time.LocalDateTime.now());
                if (request.getFuelStatus() != null)
                        booking.setPickupFuelStatus(request.getFuelStatus());
                if (request.getNotes() != null)
                        booking.setPickupCondition(request.getNotes());

                // Update Booking Status
                booking.setBookingStatus("ACTIVE");
                bookingRepository.save(booking);

                // Create Invoice Record
                InvoiceHeaderTable invoice = new InvoiceHeaderTable();
                invoice.setBooking(booking);
                invoice.setCustomer(booking.getCustomer());
                invoice.setCar(booking.getCar());
                invoice.setHandoverDate(LocalDate.now());
                invoiceRepository.save(invoice);

                return mapToResponse(booking);
        }

        public BookingResponse returnCar(ReturnRequest request) {
                BookingHeaderTable booking = bookingRepository.findById(request.getBookingId())
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                if (!"ACTIVE".equalsIgnoreCase(booking.getBookingStatus())) {
                        throw new RuntimeException("Booking is not ACTIVE");
                }

                // Update Booking Status
                booking.setBookingStatus("COMPLETED");

                // Capture Return Details
                booking.setReturnTime(java.time.LocalDateTime.now());
                if (request.getFuelStatus() != null)
                        booking.setReturnFuelStatus(request.getFuelStatus());
                if (request.getNotes() != null)
                        booking.setReturnCondition(request.getNotes());

                bookingRepository.save(booking);

                // Update Car Availability
                CarMaster car = booking.getCar();
                car.setIsAvailable(CarMaster.AvailabilityStatus.Y);
                carRepository.save(car);

                // Update Invoice Record
                InvoiceHeaderTable invoice = invoiceRepository.findByBooking_BookingId(booking.getBookingId());
                if (invoice != null) {
                        invoice.setReturnDate(
                                        request.getReturnDate() != null ? request.getReturnDate() : LocalDate.now());
                        // Calculate Rates (Simple logic for demo)
                        // invoice.setTotalAmt(...);
                        invoiceRepository.save(invoice);
                }

                return mapToResponse(booking);
        }

        public BookingResponse getBooking(Long bookingId) {
                BookingHeaderTable booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));
                return mapToResponse(booking);
        }

        private BookingResponse mapToResponse(BookingHeaderTable booking) {
                BookingResponse response = new BookingResponse();
                response.setBookingId(booking.getBookingId());
                response.setConfirmationNumber(booking.getConfirmationNumber());
                response.setBookingStatus(booking.getBookingStatus());
                response.setCustomerName(booking.getFirstName() + " " + booking.getLastName());
                response.setEmail(booking.getEmailId());
                response.setCarName(booking.getBookcar());

                if (booking.getCar() != null) {
                        response.setNumberPlate(booking.getCar().getNumberPlate());
                }

                if (booking.getPickupHub() != null) {
                        response.setPickupHub(booking.getPickupHub().getHubName());
                }

                if (booking.getReturnHub() != null) {
                        response.setReturnHub(booking.getReturnHub().getHubName());
                }

                response.setStartDate(booking.getStartDate());
                response.setEndDate(booking.getEndDate());
                response.setDailyRate(booking.getDailyRate());

                return response;
        }
}
