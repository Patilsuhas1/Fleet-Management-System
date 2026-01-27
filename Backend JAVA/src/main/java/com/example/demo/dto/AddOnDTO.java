package com.example.demo.dto;

import java.time.LocalDateTime;

public class AddOnDTO {

    private int addOnId;
    private String addOnName;
    private double addonDailyRate;
    private LocalDateTime rateValidUntil;

    public AddOnDTO() {
    }

    public AddOnDTO(int addOnId, String addOnName, double addonDailyRate, LocalDateTime rateValidUntil) {
        this.addOnId = addOnId;
        this.addOnName = addOnName;
        this.addonDailyRate = addonDailyRate;
        this.rateValidUntil = rateValidUntil;
    }

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
}

