package com.example.demo.Service;

import com.example.demo.Entity.CustomerMaster;

public interface CustomerService {
    CustomerMaster AddCustomer(CustomerMaster customer);

    CustomerMaster findByEmail(String email);

    CustomerMaster findByMembershipId(String membershipId);

}
