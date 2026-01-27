package com.example.demo.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "add_on_master")
@Data
public class AddOnMaster {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "add_on_id")
    private int addOnId;
	
	public int getAddOnId() {
		return addOnId;
	}

	public void setAddOnId(int addOnId) {
		this.addOnId = addOnId;
	}

	public String getAddOnName() {
		return addOnName;
	}

	public void setAddOnName(String addOnName) {
		this.addOnName = addOnName;
	}

	public double getAddonDailyRate() {
		return addonDailyRate;
	}

	public void setAddonDailyRate(double addonDailyRate) {
		this.addonDailyRate = addonDailyRate;
	}

	public LocalDateTime getRateValidUntil() {
		return rateValidUntil;
	}

	public void setRateValidUntil(LocalDateTime rateValidUntil) {
		this.rateValidUntil = rateValidUntil;
	}

	@Column(name="add_on_name")
	private String addOnName;
	
	@Column(name="add_on_daily_rate")
	private double addonDailyRate;
	    
	@Column(name="rate_valid_until")    
	private LocalDateTime rateValidUntil;
	

}

