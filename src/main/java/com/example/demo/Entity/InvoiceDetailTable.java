package com.example.demo.Entity;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "invoice_detail_table")
@Data
public class InvoiceDetailTable {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "invdtl_id")
	private long invdtlId;
	
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private InvoiceHeaderTable invoice;

    @ManyToOne
    @JoinColumn(name = "addon_id")
    private AddOnMaster addon;

    @Column(name = "addon_amt")
    private double addonAmt;

}

