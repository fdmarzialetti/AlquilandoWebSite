package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.car.CarGetDto;
import com.devgol53.rent_website.dtos.car.CarPostDto;
import com.devgol53.rent_website.entities.Car;
import com.devgol53.rent_website.enums.CarStatus;
import com.devgol53.rent_website.exceptions.CarNotFoundExeption;
import com.devgol53.rent_website.repositories.CarRepositorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/car")
public class CarController {
    @Autowired
    CarRepositorie carRepositorie;

    @PreAuthorize("hasAnyRole('CLIENT', 'EMPLOYEE', 'ADMIN')")
    @GetMapping("available")
    public List<CarGetDto> getAvailableCars(){
        return carRepositorie.findAll().stream().filter(car->car.getStatus()== CarStatus.AVAILABLE).map(CarGetDto::new).toList();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("all")
    public List<CarGetDto> getAllCars(){
        return carRepositorie.findAll().stream().map(CarGetDto::new).toList();
    }
    @GetMapping("{id}")
    public CarGetDto getCarById(@PathVariable long id){
        return new CarGetDto(carRepositorie.findById(id).orElseThrow(()->new CarNotFoundExeption(id)));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("create")
    public ResponseEntity<CarGetDto> createCar(@RequestBody CarPostDto carPostDto){
        Car newCar = new Car(carPostDto);
        carRepositorie.save(newCar);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CarGetDto(newCar));
    }
}
