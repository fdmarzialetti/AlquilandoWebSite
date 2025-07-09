package com.devgol53.rent_website.dtos.reservation;

import com.devgol53.rent_website.dtos.vehicle.VehicleGetDTO;
import com.devgol53.rent_website.entities.Reservation;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class ReservationSummaryDto {
    private long id;
    private String code;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double payment;
    private String modelName;
    private String branchName;
    private VehicleGetDTO vehicle; // <-- Vehículo asignado

    public ReservationSummaryDto(Reservation reservation) {
        this.id = reservation.getId();
        this.code = reservation.getCode();
        this.startDate = reservation.getStartDate();
        this.endDate = reservation.getEndDate();
        this.payment = reservation.getPayment();
        this.modelName = reservation.getModel().getBrand() + " - " + reservation.getModel().getName();
        this.branchName = reservation.getBranch().getCity() + " - " + reservation.getBranch().getAddress();

        if (reservation.getVehicle() != null) {
            this.vehicle = new VehicleGetDTO(reservation.getVehicle());
        }
    }
}
