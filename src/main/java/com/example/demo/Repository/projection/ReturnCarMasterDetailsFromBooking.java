package com.example.demo.Repository.projection;

import java.util.Date;

public interface ReturnCarMasterDetailsFromBooking {

    String getStatus();
    String getCarName();

    String getIsAvailable();

    Date getMaintenanceDueDate();

    double getMileage();

    String getNumberPlate();

    long getBookingId();

    String getCarType_name();

    double getDaily_rate();

    double getWeekly_rate();

    double getMonthly_rate();
}

