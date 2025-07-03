package com.devgol53.rent_website.dtos.reservation;

import com.devgol53.rent_website.entities.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

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

    public ReservationGetDto(Reservation reservation){
        this.id = reservation.getId();
        this.code = reservation.getCode();
        this.startDate = reservation.getStartDate();
        this.endDate = reservation.getEndDate();
        this.payment = reservation.getPayment();
        this.branchId = reservation.getBranch().getId();
        this.modelId = reservation.getModel().getId();
        this.branchName = reservation.getBranch().getCity(); // o .getAddress() si prefieres
        this.modelName = reservation.getModel().getBrand() +" - "+reservation.getModel().getName();
        this.isCancelled = reservation.getCancelled();
    }
}
