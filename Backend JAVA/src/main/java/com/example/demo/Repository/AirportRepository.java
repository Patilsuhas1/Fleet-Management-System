package com.example.demo.Repository;

import com.example.demo.Entity.AirportMaster;
import com.example.demo.Repository.projection.HubInfoProjection;
import com.example.demo.Entity.AirportMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;

@Repository
public interface AirportRepository extends JpaRepository<AirportMaster, Integer> {

    @Query(value = "SELECT h.hub_id as hubId, h.hub_name as hubName, h.hub_address_and_details as hubAddress, " +
    		"h.city_id as cityId, h.state_id as stateId, " +
    		"c.city_name as cityName, s.state_name as stateName " +
    		"FROM hub_master h " +
    		"JOIN city_master c ON h.city_id = c.city_id " +
    		"JOIN state_master s ON h.state_id = s.state_id " +
    		"JOIN airport_master a ON a.hub_id = h.hub_id " +
    		"WHERE a.airport_code = ?1", nativeQuery = true)

    List<HubInfoProjection> getAirportByNames (String airportCode);
}






