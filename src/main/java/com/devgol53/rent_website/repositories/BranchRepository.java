package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BranchRepository extends JpaRepository<Branch,Long> {
}
