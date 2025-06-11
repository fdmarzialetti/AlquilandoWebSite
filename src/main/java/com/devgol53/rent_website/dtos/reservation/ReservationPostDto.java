package com.devgol53.rent_website.dtos.reservation;

import com.devgol53.rent_website.dtos.card.CardDTO;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.entities.Reservation;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.Date;
@NoArgsConstructor
@Getter
public class ReservationPostDto {
    private LocalDate startDate;
    private LocalDate endDate;
    private long branch;
    private long model;
    private Double payment;
    private String titular;
    private String cardNumber;
    private String cardCode;

    public ReservationPostDto(Reservation reservation){
        this.startDate = reservation.getStartDate();
        this.endDate = reservation.getEndDate();
        this.branch = reservation.getBranch().getId();
        this.model = reservation.getModel().getId();
        this.payment = reservation.getPayment();
    }
}
