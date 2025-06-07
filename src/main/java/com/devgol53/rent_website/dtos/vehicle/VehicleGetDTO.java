package com.devgol53.rent_website.dtos.vehicle;

import com.devgol53.rent_website.entities.Vehicle;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleGetDTO {
    private Long id;
    private String patent;
    private int yearV;
    private String model;
    private String branch;

    public VehicleGetDTO(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.patent = vehicle.getPatent();
        this.yearV = vehicle.getYearV();
        this.model = vehicle.getModel().getBrand() + " " + vehicle.getModel().getName(); // Ej: "Toyota Corolla"
        this.branch = vehicle.getBranch().getCity() + " - " + vehicle.getBranch().getAddress(); // Ej: "CABA - Av. Rivadavia 1000"
    }
}