package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Additional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdditionalRepository extends JpaRepository<Additional, Long> {

    // Buscar solo los adicionales activos
    List<Additional> findByStateTrue();

    // Verificar si ya existe un adicional con ese nombre (ignora mayúsculas)
    boolean existsByNameIgnoreCase(String name);

    // Verificar si ya existe otro adicional (distinto al actual) con ese nombre (ignora mayúsculas)
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
