package com.devgol53.rent_website.dtos.reservation;

import com.devgol53.rent_website.entities.Reservation;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class ReservationGetDto {
    private long id;
    private String code;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double payment;
    private long branchId;
    private long modelId;
    private String branchName;
    private String modelName;
    private Boolean isCancelled;
    private long vehicleId;
    private long valorationId;

    public ReservationGetDto(Reservation reservation) {
        this.id = reservation.getId();
        this.code = reservation.getCode();
        this.startDate = reservation.getStartDate();
        this.endDate = reservation.getEndDate();
        this.payment = reservation.getPayment();

        // Validación para branch
        if (reservation.getBranch() != null) {
            this.branchId = reservation.getBranch().getId();
            this.branchName = reservation.getBranch().getCity();
        } else {
            this.branchId = 0;
            this.branchName = "Sin sucursal";
        }

        // Validación para model
        if (reservation.getModel() != null) {
            this.modelId = reservation.getModel().getId();
            this.modelName = reservation.getModel().getBrand() + " - " + reservation.getModel().getName();
        } else {
            this.modelId = 0;
            this.modelName = "Sin modelo";
        }

        this.isCancelled = reservation.getCancelled();

        // Validación para vehicle
        this.vehicleId = reservation.getVehicle() != null ? reservation.getVehicle().getId() : 0;

        // Validación para valoration
        this.valorationId = reservation.getValoration() != null ? reservation.getValoration().getId() : 0;
    }
}
