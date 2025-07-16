package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<Model,Long> {
    Boolean existsByBrandIgnoreCaseAndNameIgnoreCase(String brand, String name);
    boolean existsByBrandIgnoreCaseAndNameIgnoreCaseAndIdNot(String brand, String name, Long id);

    Optional<Model> findByBrandAndName(String brand, String name);

    Optional<Model> findByName(String name);

    List<Model> findByStatusTrue();

    List<Model> findByStatusFalse();
}
