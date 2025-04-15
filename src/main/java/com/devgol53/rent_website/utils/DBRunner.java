package com.devgol53.rent_website.utils;

import com.devgol53.rent_website.entities.Car;
import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.enums.CarStatus;
import com.devgol53.rent_website.enums.UserRol;
import com.devgol53.rent_website.repositories.CarRepositorie;
import com.devgol53.rent_website.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DBRunner implements CommandLineRunner {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    CarRepositorie carRepositorie;
    @Autowired
    AppUserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        carRepositorie.saveAll(
                Arrays.asList(
                    new Car("Ford","Fiesta", CarStatus.MAINTENANCE),
                    new Car("Ford","Eco Sport",CarStatus.MAINTENANCE),
                    new Car("Renault","Logan",CarStatus.MAINTENANCE)
                )
        );
        carRepositorie.save(new Car("VolksWagen","Suran",CarStatus.MAINTENANCE));
        userRepository.save(new AppUser("Maria","Ceccato","00000000","","mariaceccato@gmail.com", passwordEncoder.encode("Alquilando"), UserRol.ADMIN));
        userRepository.save(new AppUser("Fernando","Marzialetti","35060094","","fdmarzialetti@gmail.com", passwordEncoder.encode("DevGol53"), UserRol.CLIENT));
        userRepository.save(new AppUser("Martin","Esquercia","11111111","","martincito@gmail.com", passwordEncoder.encode("aguantelafalopa"), UserRol.EMPLOYEE));
    }
}
