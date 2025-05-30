package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client,Long> {
    boolean existsByEmail(String email);
    boolean existsByDni(String dni);
}
