package com.example.demo.dto;
import java.util.Date;

public class ReturnCarMasterDetailsDTO {




    public class CarDetailsDTO {

        private String status;
        private String carName;
        private String is_available;
        private Date maintenance_due_date;
        private double mileage;
        private String numberPlate;



        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getCarName() {
            return carName;
        }

        public void setCarName(String carName) {
            this.carName = carName;
        }

        public String getIsAvailable() {
            return is_available;
        }

        public void setIsAvailable(String isAvailable) {
            this.is_available = isAvailable;
        }

        public Date getMaintenanceDueDate() {
            return maintenance_due_date;
        }

        public void setMaintenanceDueDate(Date maintenanceDueDate) {
            this.maintenance_due_date = maintenanceDueDate;
        }

        public double getMileage() {
            return mileage;
        }

        public void setMileage(double mileage) {
            this.mileage = mileage;
        }

        public String getNumberPlate() {
            return numberPlate;
        }

        public void setNumberPlate(String numberPlate) {
            this.numberPlate = numberPlate;
        }
    }


}

