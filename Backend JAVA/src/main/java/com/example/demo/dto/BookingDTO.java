package com.example.demo.dto;

public class BookingDTO {

    private String address_1;
    private String address_2;
    private String city;
    private String cust_name;
    private String email;
    private String password;
    private String phone;
    private String pin;
    private String state;

    private String bookcar;


    public String getBookcar() {
        return bookcar;
    }

    public void setBookcar(String bookcar) {
        this.bookcar = bookcar;
    }

    public String getAddress_1() {
        return address_1;
    }

    public void setAddress_1(String address_1) {
        this.address_1 = address_1;
    }


    public String getAddress_2() {
        return address_2;
    }

    public void setAddress_2(String address_2) {
        this.address_2 = address_2;
    }


    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }


    public String getCust_name() {
        return cust_name;
    }

    public void setCust_name(String cust_name) {
        this.cust_name = cust_name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Getter and Setter for password
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Getter and Setter for phone
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    // Getter and Setter for state
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public BookingDTO(String address_1, String address_2, String city, String cust_name, String email, String password, String phone, String pin, String state) {
        this.address_1 = address_1;
        this.address_2 = address_2;
        this.city = city;
        this.cust_name = cust_name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.pin = pin;
        this.state = state;
    }
}

