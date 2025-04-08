package com.devgol53.rent_website.utils;

import com.devgol53.rent_website.entities.Car;
import com.devgol53.rent_website.enums.CarStatus;
import com.devgol53.rent_website.repositories.CarRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;

@Component
public class DBRunner implements CommandLineRunner {
    @Autowired
    CarRepositorie carRepositorie;
    @Override
    public void run(String... args) throws Exception {
        carRepositorie.saveAll(
                Arrays.asList(
                    new Car("Ford","Fiesta", CarStatus.MANTENIMIENTO),
                    new Car("Ford","Eco Sport",CarStatus.MANTENIMIENTO),
                    new Car("Renault","Logan",CarStatus.MANTENIMIENTO)
                )
        );
    }
}
