package com.example.demo.Repository;

import com.example.demo.Entity.CarMaster;
import com.example.demo.Repository.projection.ReturnCarMasterDetailsFromBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface GetCarDetailsFromBooking extends JpaRepository<CarMaster,Integer> {


//   @Query(value = "SELECT c.car_name, c.status, c.is_available, c.mileage, b.booking_id, c.number_plate " +
//           "FROM car_master c " +
//           "LEFT JOIN booking_header_table b ON c.car_id = b.car_id " +
//           "WHERE b.`select car` = :Bookcar", nativeQuery = true)

   @Query(value = "SELECT c.car_name, c.status, c.is_available, c.mileage, b.booking_id, c.number_plate, \n" +
           "       ct.cartype_name, ct.daily_rate, ct.weekly_rate, ct.monthly_rate\n" +
           "FROM car_master c\n" +
           "LEFT JOIN booking_header_table b ON c.car_id = b.car_id\n" +
           "LEFT JOIN car_type_master ct ON c.cartype_id = ct.cartype_id\n" +
           "WHERE b.`select car` = :Bookcar",nativeQuery = true)

   public List<ReturnCarMasterDetailsFromBooking> GetDetailsOfCarFromBooking( @Param("Bookcar") String Bookcar);
}

