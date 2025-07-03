package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Additional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdditionalRepository extends JpaRepository<Additional, Long> {
    List<Additional> findByStateTrue();
    boolean existsByNameIgnoreCase(String name);
}
