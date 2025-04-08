package com.devgol53.rent_website.dtos.car;

import com.devgol53.rent_website.entities.Car;
import com.devgol53.rent_website.enums.CarStatus;
import lombok.Getter;

@Getter
public class CarGetDto {
    private long id;
    private String model;
    private String brand;
    private CarStatus status;

    public CarGetDto(Car car){
        this.id = car.getId();
        this.brand = car.getBrand();
        this.model = car.getModel();
        this.status = car.getStatus();
    }
}
