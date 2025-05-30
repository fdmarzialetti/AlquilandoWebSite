package com.devgol53.rent_website.dtos.reservation;

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
    private Branch branch;
    private Model model;
    private Double payment;

    public ReservationPostDto(Reservation reservation){
        this.startDate = getStartDate();
        this.endDate = getEndDate();
        this.branch = getBranch();
        this.model = getModel();
        this.payment = getPayment();
    }
}
