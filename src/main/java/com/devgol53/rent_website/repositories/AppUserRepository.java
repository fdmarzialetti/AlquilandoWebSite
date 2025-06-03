package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser,Long> {
    Optional<AppUser> findByEmail(String username);
    boolean existsByEmail(String email);
    boolean existsByDni(String dni);
}
