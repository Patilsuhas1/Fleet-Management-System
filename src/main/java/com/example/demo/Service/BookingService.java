package com.example.demo.Service;

import com.example.demo.Entity.*;
import com.example.demo.Repository.*;
import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.dto.ReturnRequest;
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
                BookingHeaderTable booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                if (!"CONFIRMED".equalsIgnoreCase(booking.getBookingStatus())) {
                        throw new RuntimeException("Booking is not in CONFIRMED state");
                }

                // Update Booking Status
                booking.setBookingStatus("ACTIVE");
                bookingRepository.save(booking);

                // Update Car Availability
                CarMaster car = booking.getCar();
                car.setIsAvailable(CarMaster.AvailabilityStatus.N);
                carRepository.save(car);

                // Create Invoice Record (Start)
                InvoiceHeaderTable invoice = new InvoiceHeaderTable();
                invoice.setBooking(booking);
                invoice.setCustomer(booking.getCustomer());
                invoice.setCar(booking.getCar());
                invoice.setHandoverDate(LocalDate.now());
                // Initialize other fields if necessary
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
