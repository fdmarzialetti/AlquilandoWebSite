package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Reservation;
import com.devgol53.rent_website.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    Optional<Reservation> findByCode(String code);

    //boolean existsByVehicleAndDatesOverlap(Vehicle v, LocalDate startDate, LocalDate endDate);
}
