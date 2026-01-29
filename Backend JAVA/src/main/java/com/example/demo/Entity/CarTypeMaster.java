package com.example.demo.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "car_type_master")
@Data
public class CarTypeMaster {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartype_id")
    private long carTypeId;
	
	@Column(name = "cartype_name")
	private String carTypeName;

	@Column(name = "daily_rate")
	private double dailyRate;

	@Column(name = "weekly_rate")
	private double weeklyRate;

	 @Column(name = "monthly_rate")
	 private double monthlyRate;

	 @Column(name = "image_path")
	 private String imagePath;

	public long getCarTypeId() {
		return carTypeId;
	}

	public void setCarTypeId(long carTypeId) {
		this.carTypeId = carTypeId;
	}

	public String getCarTypeName() {
		return carTypeName;
	}

	public void setCarTypeName(String carTypeName) {
		this.carTypeName = carTypeName;
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

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	
	
}

