package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepositorie extends JpaRepository<Car, Long> {
}
