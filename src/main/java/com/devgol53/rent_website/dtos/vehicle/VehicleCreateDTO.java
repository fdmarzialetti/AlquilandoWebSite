package com.devgol53.rent_website.dtos.vehicle;

import com.devgol53.rent_website.entities.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class VehicleCreateDTO {
    private String patent;
    private int yearV;
    private long modelId;
    private long branchId;
}
