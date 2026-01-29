package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.CustomerMaster;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerMaster, Integer> {

    CustomerMaster findByEmailIgnoreCase(String email);

    CustomerMaster findByMembershipId(String membershipId);

}
