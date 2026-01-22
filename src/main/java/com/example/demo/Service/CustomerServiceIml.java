package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.CustomerMaster;
import com.example.demo.Repository.CustomerRepository;

@Service
public class CustomerServiceIml implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public CustomerMaster AddCustomer(CustomerMaster customer) {
        CustomerMaster customerMaster = customerRepository.save(customer);
        return customerMaster;
    }

    @Override
    public CustomerMaster findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    @Override
    public CustomerMaster findByMembershipId(String membershipId) {
        return customerRepository.findByMembershipId(membershipId);
    }

    @Override
    public CustomerMaster saveOrUpdateCustomer(CustomerMaster customer) {
        CustomerMaster existing = customerRepository.findByEmail(customer.getEmail());
        if (existing != null) {
            // Update existing customer details
            customer.setCustId(existing.getCustId()); // Preserve ID
            // Allow fields to be updated
            return customerRepository.save(customer);
        } else {
            // Create new
            return customerRepository.save(customer);
        }
    }

}
