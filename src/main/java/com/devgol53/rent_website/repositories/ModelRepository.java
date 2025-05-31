package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<Model,Long> {
    Boolean existsByBrandAndName(String brand, String name);

    Optional<Model> findByBrandAndName(String brand, String name);
}
