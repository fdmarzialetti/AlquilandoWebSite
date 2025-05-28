package com.devgol53.rent_website.dtos.vehicle;

import com.devgol53.rent_website.entities.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VehicleCreateDTO {
    private String patent;
    private int yearV;
    private long modelId;
}
