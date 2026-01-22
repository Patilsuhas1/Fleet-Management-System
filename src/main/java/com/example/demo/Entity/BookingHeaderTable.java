package com.example.demo.Entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "booking_header_table")
@Data
public class BookingHeaderTable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "booking_id")
	private long bookingId;

	@Column(name = "booking_date")
	private LocalDate bookingDate;

	@Column(name = "confirmation_number", unique = true)
	private String confirmationNumber;

	@Column(name = "booking_status")
	private String bookingStatus; // CONFIRMED, CANCELLED, ALLOTTED, COMPLETED

	@ManyToOne
	@JoinColumn(name = "cust_id", referencedColumnName = "cust_id", nullable = false)
	private CustomerMaster customer;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "end_date")
	private LocalDate endDate;

	@ManyToOne
	@JoinColumn(name = "pickup_location_id") // Maps to hub_master
	private HubMaster pickupHub; // Mapped from logic, usually implicit in car but needed for search

	@ManyToOne
	@JoinColumn(name = "return_hub_id")
	private HubMaster returnHub;

	@ManyToOne
	@JoinColumn(name = "cartype_id")
	private CarTypeMaster carType;

	@ManyToOne
	@JoinColumn(name = "car_id")
	private CarMaster car;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "address")
	private String address;

	@Column(name = "state")
	private String state;

	@Column(name = "pin")
	private String pin;

	@Column(name = "daily_rate")
	private double dailyRate;

	@Column(name = "weekly_rate")
	private double weeklyRate;

	@Column(name = "monthly_rate")
	private double monthlyRate;

	@Column(name = "Email_ID")
	private String emailId;

	public long getBookingId() {
		return bookingId;
	}

	public void setBookingId(long bookingId) {
		this.bookingId = bookingId;
	}

	public LocalDate getBookingDate() {
		return bookingDate;
	}

	public void setBookingDate(LocalDate bookingDate) {
		this.bookingDate = bookingDate;
	}

	public CustomerMaster getCustomer() {
		return customer;
	}

	public void setCustomer(CustomerMaster customer) {
		this.customer = customer;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public CarTypeMaster getCarType() {
		return carType;
	}

	public void setCarType(CarTypeMaster carType) {
		this.carType = carType;
	}

	public CarMaster getCar() {
		return car;
	}

	public void setCar(CarMaster car) {
		this.car = car;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getPin() {
		return pin;
	}

	public void setPin(String pin) {
		this.pin = pin;
	}

	public double getDailyRate() {
		return dailyRate;
	}

	public void setDailyRate(double dailyRate) {
		this.dailyRate = dailyRate;
	}

	public double getWeeklyRate() {
		return weeklyRate;
	}

	public void setWeeklyRate(double weeklyRate) {
		this.weeklyRate = weeklyRate;
	}

	public double getMonthlyRate() {
		return monthlyRate;
	}

	public void setMonthlyRate(double monthlyRate) {
		this.monthlyRate = monthlyRate;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getBookcar() {
		return Bookcar;
	}

	public void setBookcar(String bookcar) {
		Bookcar = bookcar;
	}

	@Column(name = "BookCar")
	private String Bookcar;

}
