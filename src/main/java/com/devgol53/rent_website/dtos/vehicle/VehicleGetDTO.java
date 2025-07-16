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
    private Long modelId;
    private String branch;
    private Long branchId;
    private Boolean maintence;

    public VehicleGetDTO(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.patent = vehicle.getPatent();
        this.yearV = vehicle.getYearV();
        this.maintence = vehicle.getMaintence();

        this.model = vehicle.getModel().getBrand() + " " + vehicle.getModel().getName();
        this.modelId = vehicle.getModel().getId();

        this.branch = vehicle.getBranch().getCity() + " - " + vehicle.getBranch().getAddress();
        this.branchId = vehicle.getBranch().getId();
    }
}