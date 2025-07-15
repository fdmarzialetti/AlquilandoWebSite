package com.devgol53.rent_website.repositories;

import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.enums.UserRol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByDni(String dni); // ✅ AGREGADO

    boolean existsByEmail(String email);

    boolean existsByDni(String dni);

    List<AppUser> findByRolAndStateTrue(UserRol rol);

    List<AppUser> findByRolAndStateFalse(UserRol rol);
}
