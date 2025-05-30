package com.devgol53.rent_website.entities;

import com.devgol53.rent_website.dtos.reservation.ReservationPostDto;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;

    private String code;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    private Branch branch;

    @ManyToOne
    private Model model;

    private Double payment;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private AppUser client;

    // private Valoration valoration;

    public Reservation(String code,LocalDate startDate, LocalDate endDate, Branch branch, Model model, Double payment, AppUser client) {
        this.code = code;
        this.startDate = startDate;
        this.endDate = endDate;
        this.branch = branch;
        this.model = model;
        this.payment = payment;
        this.client = client;
    }

    public Reservation(String code, ReservationPostDto reservationPostDto){
        this.code=code;
        this.startDate = reservationPostDto.getStartDate();
        this.endDate = reservationPostDto.getEndDate();
        this.payment = reservationPostDto.getPayment();
    }

    public void addModel(Model model){
        this.model=model;
        model.addReservation(this);
    }

    public void addBranch(Branch branch){
        this.branch=branch;
        branch.addReservation(this);
    }

    public void addClient(AppUser client){
        this.client=client;
        client.addReservation(this);
    }

}
