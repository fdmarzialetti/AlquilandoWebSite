package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch,Long> {
    boolean existsByCityIgnoreCaseAndAddressIgnoreCase(String city, String address);
    boolean existsByCityIgnoreCaseAndAddressIgnoreCaseAndIdNot(String city, String address, Long id);
    List<Branch> findByStateTrue();
}
