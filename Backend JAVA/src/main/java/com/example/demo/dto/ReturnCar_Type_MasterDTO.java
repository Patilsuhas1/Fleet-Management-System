package com.example.demo.dto;

public class ReturnCar_Type_MasterDTO {
    public String carType_name;

    public double daily_rate;

    public double weekly_rate;

    public double monthly_rate;



    public ReturnCar_Type_MasterDTO(String carType_name, double daily_rate, double weekly_rate, double monthly_rate) {
        this.carType_name = carType_name;
        this.daily_rate = daily_rate;
        this.weekly_rate = weekly_rate;
        this.monthly_rate = monthly_rate;
    }


    public String getCarType_name() {
        return carType_name;
    }

    public void setCarType_name(String carType_name) {
        this.carType_name = carType_name;
    }

    public double getDaily_rate() {
        return daily_rate;
    }

    public void setDaily_rate(double daily_rate) {
        this.daily_rate = daily_rate;
    }

    public double getWeekly_rate() {
        return weekly_rate;
    }

    public void setWeekly_rate(double weekly_rate) {
        this.weekly_rate = weekly_rate;
    }

    public double getMonthly_rate() {
        return monthly_rate;
    }

    public void setMonthly_rate(double monthly_rate) {
        this.monthly_rate = monthly_rate;
    }
}

