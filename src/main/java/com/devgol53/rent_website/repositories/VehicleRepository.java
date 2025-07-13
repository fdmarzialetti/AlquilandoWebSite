package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    boolean existsByPatent(String patent);
    Optional<Vehicle> findByPatent(String patent);

    List<Vehicle> findByActiveTrue();
    List<Vehicle> findByActiveFalse();
}
