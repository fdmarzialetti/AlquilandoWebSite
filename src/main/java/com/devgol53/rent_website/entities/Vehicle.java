package com.devgol53.rent_website.entities;

import com.devgol53.rent_website.dtos.vehicle.VehicleCreateDTO;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private Long id;
    private String patent;
    private Boolean maintence;
    private int yearV;
    private boolean active;


    @OneToMany (mappedBy = "vehicle", cascade = CascadeType.PERSIST)
    private List<Reservation> reservations = new ArrayList<>();

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Model model;

    public Vehicle(){};

    public Vehicle(String patent, Boolean maintence, int year) {
        this.patent = patent.replaceAll("\\s+", "").toUpperCase();
        this.maintence = maintence;
        this.yearV = year;
        this.active = true;
    }

    public Vehicle(VehicleCreateDTO vehicleCreateDTO){
        this.patent = vehicleCreateDTO.getPatent().replaceAll("\\s+", "").toUpperCase();
        this.yearV = vehicleCreateDTO.getYearV();
        this.maintence = vehicleCreateDTO.getMaintence();
        this.active = true;
    }

    public void addModel(Model model){
        this.model=model;
        model.addVehicle(this);
    }

    public void addBranch(Branch branch){
        this.branch=branch;
        branch.addVehicle(this);
    }

    public boolean hasOverlappingReservation(LocalDate startDate, LocalDate endDate) {
        for (Reservation reservation : reservations) {
            LocalDate resStart = reservation.getStartDate();
            LocalDate resEnd = reservation.getEndDate();

            boolean overlap = !resEnd.isBefore(startDate) && !resStart.isAfter(endDate);

            if (overlap) {
                return true;
            }
        }
        return false;
    }

    public boolean hasOngoingReservationToday() {
        LocalDate today = LocalDate.now();
        for (Reservation reservation : reservations) {
            if (!reservation.getStartDate().isAfter(today) && !reservation.getEndDate().isBefore(today)) {
                return true;
            }
        }
        return false;
    }

    public void addReservation(Reservation reservation){
        this.reservations.add(reservation);
    }

}
