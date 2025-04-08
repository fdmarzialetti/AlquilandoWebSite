package com.devgol53.rent_website.dtos.car;

import com.devgol53.rent_website.enums.CarStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CarPostDto {
    private String brand;
    private String model;
    private CarStatus status;
}
