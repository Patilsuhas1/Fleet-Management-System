package com.example.demo.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "customer_master")
@Data
public class CustomerMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cust_id")
	private int custId;

	@Column(name = "membership_id", unique = true)
	private String membershipId;

	private String firstName;

	private String lastName;

	private String addressLine1;

	private String addressLine2;

	@Column(unique = true)
	private String email;

	private String city;

	private String pincode;

	private String phoneNumber;

	private String mobileNumber;

	private String creditCardType;

	private String creditCardNumber;

	private String drivingLicenseNumber;

	private String idpNumber; // International Driving Permit

	private String issuedByDL;

	private LocalDate validThroughDL;

	private String passportNumber;

	private LocalDate passportValidThrough;

	private String passportIssuedBy;

	private LocalDate passportValidFrom;

	private LocalDate passportIssueDate;

	private LocalDate dateOfBirth;

	public int getCustId() {
		return custId;
	}

	public void setCustId(int custId) {
		this.custId = custId;
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

	public String getAddressLine1() {
		return addressLine1;
	}

	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}

	public String getAddressLine2() {
		return addressLine2;
	}

	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPincode() {
		return pincode;
	}

	public void setPincode(String pincode) {
		this.pincode = pincode;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getCreditCardType() {
		return creditCardType;
	}

	public void setCreditCardType(String creditCardType) {
		this.creditCardType = creditCardType;
	}

	public String getCreditCardNumber() {
		return creditCardNumber;
	}

	public void setCreditCardNumber(String creditCardNumber) {
		this.creditCardNumber = creditCardNumber;
	}

	public String getDrivingLicenseNumber() {
		return drivingLicenseNumber;
	}

	public void setDrivingLicenseNumber(String drivingLicenseNumber) {
		this.drivingLicenseNumber = drivingLicenseNumber;
	}

	public String getIdpNumber() {
		return idpNumber;
	}

	public void setIdpNumber(String idpNumber) {
		this.idpNumber = idpNumber;
	}

	public String getIssuedByDL() {
		return issuedByDL;
	}

	public void setIssuedByDL(String issuedByDL) {
		this.issuedByDL = issuedByDL;
	}

	public LocalDate getValidThroughDL() {
		return validThroughDL;
	}

	public void setValidThroughDL(LocalDate validThroughDL) {
		this.validThroughDL = validThroughDL;
	}

	public String getPassportNumber() {
		return passportNumber;
	}

	public void setPassportNumber(String passportNumber) {
		this.passportNumber = passportNumber;
	}

	public LocalDate getPassportValidThrough() {
		return passportValidThrough;
	}

	public void setPassportValidThrough(LocalDate passportValidThrough) {
		this.passportValidThrough = passportValidThrough;
	}

	public String getPassportIssuedBy() {
		return passportIssuedBy;
	}

	public void setPassportIssuedBy(String passportIssuedBy) {
		this.passportIssuedBy = passportIssuedBy;
	}

	public LocalDate getPassportValidFrom() {
		return passportValidFrom;
	}

	public void setPassportValidFrom(LocalDate passportValidFrom) {
		this.passportValidFrom = passportValidFrom;
	}

	public LocalDate getPassportIssueDate() {
		return passportIssueDate;
	}

	public void setPassportIssueDate(LocalDate passportIssueDate) {
		this.passportIssueDate = passportIssueDate;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

}

