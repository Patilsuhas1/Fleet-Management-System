package com.example.demo.Entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "invoice_header_table")
@Data
public class InvoiceHeaderTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private long invoiceId;

    @Column(name = "date")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private BookingHeaderTable booking;

    @ManyToOne
    @JoinColumn(name = "cust_id")
    private CustomerMaster customer;

    @Column(name = "handover_date")
    private LocalDate handoverDate;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private CarMaster car;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "rental_amt")
    private double rentalAmt;

    @Column(name = "total_addon_amt")
    private double totalAddonAmt;

    @Column(name = "total_amt")
    private double totalAmt;

    @Column(name = "customer_details")
    private String customerDetails;

    @Column(name = "rate")
    private String rate;

}
